export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({
    "src/yffd39d9g7szeziw2mfpmga9q1231t.html": "yffd39d9g7szeziw2mfpmga9q1231t.html"
  });

  const asArray = (items) => Array.isArray(items) ? items : [];

  eleventyConfig.addFilter("active", (items = []) =>
    asArray(items).filter((item) => item?.is_active !== false)
  );

  eleventyConfig.addFilter("limit", (items = [], count = 0) =>
    asArray(items).slice(0, Math.max(0, Number(count) || 0))
  );

  eleventyConfig.addFilter("inSpace", (items = [], slug = "") =>
    asArray(items).filter((item) =>
      item?.is_active !== false &&
      Array.isArray(item?.spaces) &&
      item.spaces.includes(slug)
    )
  );

  eleventyConfig.addFilter("inCategory", (items = [], categoryId = "") =>
    asArray(items).filter((item) =>
      item?.is_active !== false &&
      String(item?.category_id) === String(categoryId)
    )
  );

  eleventyConfig.addFilter("offers", (items = []) =>
    asArray(items).filter((item) =>
      item?.is_active !== false &&
      Boolean(item?.is_offer) &&
      Number(item?.price || 0) > 0
    )
  );

  eleventyConfig.addFilter("featured", (items = []) =>
    asArray(items).filter((item) =>
      item?.is_active !== false && Boolean(item?.is_featured)
    )
  );

  eleventyConfig.addFilter("relatedProducts", (items = [], current = {}) =>
    asArray(items).filter((item) =>
      item?.is_active !== false &&
      String(item?.category_id) === String(current?.category_id) &&
      String(item?.id) !== String(current?.id)
    )
  );

  eleventyConfig.addFilter("deliveriesInCategory", (items = [], categoryId = "") =>
    asArray(items).filter((item) =>
      String(item?.category_id) === String(categoryId)
    )
  );

  eleventyConfig.addFilter("deliveriesForProduct", (items = [], productId = "") =>
    asArray(items).filter((item) =>
      String(item?.product_id || "") === String(productId)
    )
  );

  eleventyConfig.addFilter("collectionProducts", (items = [], slug = "") =>
    asArray(items).filter((item) => {
      if (item?.is_active === false) return false;
      if (slug === "nestica-picks") return Boolean(item?.is_featured);
      if (slug === "small-space-solutions") {
        return Number(item?.price || 0) < 10000 &&
          ![4, 6].includes(Number(item?.category_id));
      }
      return false;
    })
  );


  eleventyConfig.addFilter("localeUrl", (value = "/", lang = "ar") => {
    let path = String(value || "/");
    if (!path.startsWith("/")) path = `/${path}`;
    if (lang === "en") {
      if (path === "/") return "/en/";
      return path.startsWith("/en/") ? path : `/en${path}`;
    }
    const clean = path.replace(/^\/en(?=\/|$)/, "");
    return clean || "/";
  });

  eleventyConfig.addFilter("switchLocaleUrl", (value = "/", targetLang = "ar") => {
    let path = String(value || "/");
    if (!path.startsWith("/")) path = `/${path}`;
    if (targetLang === "en") {
      if (path === "/") return "/en/";
      return path.startsWith("/en/") ? path : `/en${path}`;
    }
    const clean = path.replace(/^\/en(?=\/|$)/, "");
    return clean || "/";
  });

  eleventyConfig.addFilter("egp", (value) =>
    `${Number(value || 0).toLocaleString("en-US")} EGP`
  );

  eleventyConfig.addFilter("seoDesc", (value, fallback = "") => {
    const clean = String(value || fallback || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    return clean.length > 160
      ? `${clean.slice(0, 157).trim()}...`
      : clean;
  });

  eleventyConfig.addFilter("jsonLdSafe", (value = "") =>
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/[\r\n]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
  );

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("urlencode", (value) =>
    encodeURIComponent(String(value ?? ""))
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
