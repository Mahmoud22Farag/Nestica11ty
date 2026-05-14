export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  eleventyConfig.addPassthroughCopy('src/.nojekyll');
  eleventyConfig.addPassthroughCopy('CNAME');
  // ─── Existing Filters ───────────────────────────────────────────────────────

  eleventyConfig.addFilter('egp', (value) => {
    const number = Number(value || 0);
    return `${number.toLocaleString('en-US')} EGP`;
  });

  eleventyConfig.addFilter('excerpt', (value, length = 95) => {
    const text = String(value || '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > length ? text.slice(0, length).trim() + '...' : text;
  });

  eleventyConfig.addFilter('where', (array, key, expected) => {
    return (array || []).filter((item) => item && item[key] === expected);
  });

  eleventyConfig.addFilter('active', (array) => {
    return (array || []).filter((item) => item && item.is_active !== false);
  });

  eleventyConfig.addFilter('productCount', (products, categoryId) => {
    return (products || []).filter(
      (p) =>
        p.is_active !== false && Number(p.category_id) === Number(categoryId),
    ).length;
  });

  eleventyConfig.addFilter('json', (value) => JSON.stringify(value || []));

  // ─── SEO Filters ────────────────────────────────────────────────────────────

  eleventyConfig.addFilter('slugify', (value) => {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}\-]/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  });

  eleventyConfig.addFilter('seoTitle', (title, brand) => {
    if (!title) return brand || '';
    const t = String(title).trim();
    const b = String(brand || '').trim();
    if (t.length > 55) return t;
    return b ? `${t} | ${b}` : t;
  });

  eleventyConfig.addFilter('seoDesc', (value, fallback = '') => {
    const text = String(value || fallback || '')
      .replace(/\s+/g, ' ')
      .replace(/[*»•\-]+/g, '')
      .trim();
    if (!text) return '';
    return text.length > 155 ? text.slice(0, 152).trim() + '...' : text;
  });

  eleventyConfig.addFilter('absoluteUrl', (path, base) => {
    try {
      return new URL(path, base).href;
    } catch {
      return path;
    }
  });

  eleventyConfig.addFilter('jsonLdSafe', (value) => {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .trim();
  });

  // ─── Spaces & Utility Filters ────────────────────────────────────────────────

  // ✅ بديل صح لـ "in" على arrays في Nunjucks
  eleventyConfig.addFilter('inSpace', (products, space) => {
    return (products || []).filter(
      (p) =>
        p.is_active !== false &&
        Array.isArray(p.spaces) &&
        p.spaces.includes(space),
    );
  });

  // ✅ بديل صح لـ .slice() اللي مش بتشتغل في Nunjucks
  eleventyConfig.addFilter('limit', (array, n) => {
    return (array || []).slice(0, n);
  });

  // ─── Config ─────────────────────────────────────────────────────────────────

  return {
    pathPrefix: '/',
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
