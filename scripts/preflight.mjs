import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const errors = [];
const arabicPattern = /[\u0600-\u06FF]/;

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

const requiredFiles = [
  "eleventy.config.js",
  ".eleventy.js",
  "package.json",
  "src/index.njk",
  "src/en/index.njk",
  "src/en/products/index.njk",
  "src/en/products/product.njk",
  "src/en/categories/category.njk",
  "src/en/spaces/space.njk",
  "src/_data/i18n.json",
  "src/_data/products.json",
  "src/_data/categories.json",
  "src/_data/deliveries.json",
  "src/_data/guides.json",
  "src/_includes/layouts/base.njk",
  "src/_includes/layouts/product.njk"
];

for (const file of requiredFiles) {
  if (!(await exists(file))) errors.push(`Missing required file: ${file}`);
}

// .eleventy.js is intentionally kept as a compatibility shim that re-exports
// eleventy.config.js. Other config formats are still treated as conflicts.
for (const conflict of ["eleventy.config.mjs", "eleventy.config.cjs"]) {
  if (await exists(conflict)) errors.push(`Remove conflicting Eleventy config: ${conflict}`);
}

try {
  const legacyConfig = await readFile(path.join(root, ".eleventy.js"), "utf8");
  if (!legacyConfig.includes('./eleventy.config.js') && !legacyConfig.includes("./eleventy.config.js")) {
    errors.push(".eleventy.js must re-export eleventy.config.js.");
  }
} catch (error) {
  errors.push(`Unable to validate .eleventy.js compatibility shim: ${error.message}`);
}

let packageJson = {};
try {
  packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  for (const scriptName of ["start", "build"]) {
    const command = packageJson.scripts?.[scriptName] || "";
    if (!command.includes("--config=eleventy.config.js")) {
      errors.push(`package.json script '${scriptName}' must use eleventy.config.js explicitly.`);
    }
  }
} catch (error) {
  errors.push(`Invalid package.json: ${error.message}`);
}

const filters = new Map();
try {
  const configUrl = `${pathToFileURL(path.join(root, "eleventy.config.js")).href}?check=${Date.now()}`;
  const configModule = await import(configUrl);
  if (typeof configModule.default !== "function") {
    errors.push("eleventy.config.js must export a default configuration function.");
  } else {
    const mockConfig = {
      addPassthroughCopy() {},
      addFilter(name, callback) { filters.set(name, callback); }
    };
    const result = configModule.default(mockConfig);
    if (result?.dir?.input !== "src") errors.push("Eleventy input directory must be src.");
    if (result?.dir?.output !== "_site") errors.push("Eleventy output directory must be _site.");
  }
} catch (error) {
  errors.push(`Unable to load eleventy.config.js: ${error.message}`);
}

const requiredFilters = [
  "active", "limit", "inSpace", "inCategory", "offers", "featured",
  "relatedProducts", "deliveriesInCategory", "deliveriesForProduct", "collectionProducts",
  "localeUrl", "switchLocaleUrl", "egp", "seoDesc", "jsonLdSafe",
  "json", "urlencode"
];
for (const filter of requiredFilters) {
  if (!filters.has(filter)) errors.push(`Eleventy filter is not registered: ${filter}`);
}
if (filters.has("offers")) {
  const result = filters.get("offers")([
    { is_active: true, is_offer: true, price: 100 },
    { is_active: true, is_offer: false, price: 100 }
  ]);
  if (!Array.isArray(result) || result.length !== 1) errors.push("The offers filter failed its functional test.");
}
if (filters.has("localeUrl") && filters.get("localeUrl")("/products/", "en") !== "/en/products/") {
  errors.push("The localeUrl filter failed its English route test.");
}
if (filters.has("switchLocaleUrl") && filters.get("switchLocaleUrl")("/en/products/", "ar") !== "/products/") {
  errors.push("The switchLocaleUrl filter failed its Arabic route test.");
}

async function readJson(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    return [];
  }
}

const products = await readJson("src/_data/products.json");
const categories = await readJson("src/_data/categories.json");
const deliveries = await readJson("src/_data/deliveries.json");
const guides = await readJson("src/_data/guides.json");
await readJson("src/_data/i18n.json");

function validateEnglishFields(items, label, fields) {
  items.forEach((item, index) => {
    fields.forEach((field) => {
      const value = item?.[field];
      if (!value) errors.push(`${label}[${index}] is missing ${field}.`);
      else if (arabicPattern.test(String(value))) errors.push(`${label}[${index}].${field} still contains Arabic text.`);
    });
  });
}

validateEnglishFields(products, "products", ["name_en", "slug_en", "category_slug_en", "card_description_en", "description_en", "seo_title_en", "seo_description_en"]);
validateEnglishFields(categories, "categories", ["name_en", "slug_en", "seo_title_en", "meta_description_en", "intro_en"]);
validateEnglishFields(deliveries, "deliveries", ["title_en", "description_en", "alt_en"]);
validateEnglishFields(guides, "guides", ["title_en", "seo_title_en", "meta_description_en", "summary_en"]);

const ids = new Set();
const slugs = new Set();
const englishSlugs = new Set();
for (const product of products) {
  const id = String(product.id);
  if (ids.has(id)) errors.push(`Duplicate product id: ${id}`);
  ids.add(id);
  if (slugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
  if (englishSlugs.has(product.slug_en)) errors.push(`Duplicate English product slug: ${product.slug_en}`);
  englishSlugs.add(product.slug_en);
}

const imagePaths = [];
for (const product of products) {
  if (product.main_image) imagePaths.push(product.main_image);
  for (const image of product.gallery || []) imagePaths.push(image);
}
for (const item of [...categories, ...deliveries, ...guides]) {
  for (const key of ["image", "hero_image", "og_image"]) {
    if (item[key]) imagePaths.push(item[key]);
  }
}
for (const imagePath of new Set(imagePaths)) {
  const relative = path.join("src", String(imagePath).replace(/^\//, ""));
  if (!(await exists(relative))) errors.push(`Missing referenced image: ${imagePath}`);
}

if (errors.length) {
  console.error("\nNestica bilingual preflight failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`[check] Nestica bilingual preflight passed: ${products.length} products, ${categories.length} categories, ${deliveries.length} deliveries, ${guides.length} guides, ${filters.size} filters.`);
