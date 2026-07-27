'use strict';

let catalogPageSize = 24;
let catalogVisibleLimit = 24;

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .trim();
}

function getCatalogControls() {
  return {
    input: document.getElementById('productSearchInput'),
    category: document.getElementById('categoryFilter'),
    space: document.getElementById('spaceFilter'),
    price: document.getElementById('priceFilter'),
    sort: document.getElementById('sortProducts'),
    reset: document.getElementById('resetFilters'),
    grid: document.getElementById('productsGrid'),
    loadMore: document.getElementById('loadMoreProducts'),
    count: document.getElementById('visibleProductsCount'),
    empty: document.getElementById('noProductsFound')
  };
}

function priceMatches(price, range) {
  if (!range) return true;
  if (range === '0-10000') return price < 10000;
  if (range === '10000-20000') return price >= 10000 && price <= 20000;
  if (range === '20000-40000') return price > 20000 && price <= 40000;
  if (range === '40000+') return price > 40000;
  return true;
}

function getMatchingProductItems() {
  const controls = getCatalogControls();
  const query = normalizeText(controls.input?.value);
  const category = controls.category?.value || '';
  const space = controls.space?.value || '';
  const priceRange = controls.price?.value || '';
  const items = Array.from(document.querySelectorAll('.product-list-item'));

  return items.filter((item) => {
    const card = item.querySelector('[data-product-card]');
    if (!card) return false;
    const haystack = normalizeText(`${card.dataset.name || ''} ${card.dataset.category || ''} ${item.textContent || ''}`);
    const spaces = String(card.dataset.spaces || '').split(',').filter(Boolean);
    const productPrice = Number(card.dataset.price || 0);
    return (!query || haystack.includes(query))
      && (!category || card.dataset.categoryId === category)
      && (!space || spaces.includes(space))
      && priceMatches(productPrice, priceRange);
  });
}

function sortProductItems(items, sortValue) {
  const sorted = [...items];
  if (sortValue === 'price-asc') {
    sorted.sort((a, b) => Number(a.querySelector('[data-product-card]')?.dataset.price || 0) - Number(b.querySelector('[data-product-card]')?.dataset.price || 0));
  } else if (sortValue === 'price-desc') {
    sorted.sort((a, b) => Number(b.querySelector('[data-product-card]')?.dataset.price || 0) - Number(a.querySelector('[data-product-card]')?.dataset.price || 0));
  } else if (sortValue === 'name') {
    sorted.sort((a, b) => (a.querySelector('[data-product-card]')?.dataset.name || '').localeCompare(b.querySelector('[data-product-card]')?.dataset.name || '', document.documentElement.lang === 'en' ? 'en' : 'ar'));
  } else {
    sorted.sort((a, b) => Number(a.dataset.originalOrder || 0) - Number(b.dataset.originalOrder || 0));
  }
  return sorted;
}

function filterProducts() {
  const controls = getCatalogControls();
  const allItems = Array.from(document.querySelectorAll('.product-list-item'));
  if (!allItems.length) return;

  const matches = sortProductItems(getMatchingProductItems(), controls.sort?.value || 'default');
  const isMainCatalog = Boolean(controls.loadMore);
  const visibleMatches = isMainCatalog ? matches.slice(0, catalogVisibleLimit) : matches;

  if (controls.grid) {
    matches.forEach((item) => controls.grid.appendChild(item));
  }

  allItems.forEach((item) => item.classList.add('d-none'));
  visibleMatches.forEach((item) => item.classList.remove('d-none'));

  if (controls.count) controls.count.textContent = String(matches.length);
  if (controls.empty) controls.empty.classList.toggle('d-none', matches.length !== 0);
  if (controls.loadMore) {
    controls.loadMore.classList.toggle('d-none', matches.length <= catalogVisibleLimit);
  }
}

function resetCatalogFilters() {
  const controls = getCatalogControls();
  [controls.input, controls.category, controls.space, controls.price].forEach((control) => { if (control) control.value = ''; });
  if (controls.sort) controls.sort.value = 'default';
  catalogVisibleLimit = catalogPageSize;
  filterProducts();
}

function initCatalog() {
  const controls = getCatalogControls();
  if (!document.querySelector('.product-list-item')) return;

  const params = new URLSearchParams(window.location.search);
  if (controls.input && params.get('q')) controls.input.value = params.get('q');

  [controls.input, controls.category, controls.space, controls.price, controls.sort].forEach((control) => {
    if (!control) return;
    control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', () => {
      catalogVisibleLimit = catalogPageSize;
      filterProducts();
    });
  });
  controls.reset?.addEventListener('click', resetCatalogFilters);
  controls.loadMore?.addEventListener('click', () => {
    catalogVisibleLimit += catalogPageSize;
    filterProducts();
  });
  filterProducts();
}

function scrollOffers(direction) {
  const slider = document.getElementById('offersSlider');
  if (!slider) return;
  slider.scrollBy({ left: direction * 340, behavior: 'smooth' });
  window.setTimeout(updateOfferControls, 300);
}

function updateOfferControls() {
  const slider = document.getElementById('offersSlider');
  const prev = document.getElementById('offersPrev');
  const next = document.getElementById('offersNext');
  if (!slider || !prev || !next) return;
  const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
  prev.disabled = Math.abs(slider.scrollLeft) <= 3;
  next.disabled = Math.abs(slider.scrollLeft) >= maxScroll - 3;
}

function changeMainImage(src, button) {
  const image = document.getElementById('mainProductImage');
  if (!image) return;
  image.src = src;
  document.querySelectorAll('.product-thumb-btn').forEach((item) => item.classList.remove('active'));
  button?.classList.add('active');
}

function toggleNotes() {
  const notesBox = document.getElementById('notesBox');
  const custom = document.getElementById('requestTypeCustom')?.checked;
  if (notesBox) notesBox.hidden = !custom;
}

function initDeliveryFilters() {
  const buttons = Array.from(document.querySelectorAll('[data-delivery-filter]'));
  const items = Array.from(document.querySelectorAll('.delivery-list-item'));
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => button.addEventListener('click', () => {
    buttons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const value = button.dataset.deliveryFilter || 'all';
    items.forEach((item) => {
      const show = value === 'all'
        || (value.startsWith('space:') && item.dataset.space === value.split(':')[1])
        || (value.startsWith('location:') && item.dataset.location === value.split(':')[1]);
      item.classList.toggle('d-none', !show);
    });
  }));
}

function syncMobileCartCount() {
  const desktop = document.getElementById('cartCount');
  const mobile = document.getElementById('mobileCartCount');
  if (desktop && mobile) mobile.textContent = desktop.textContent || '0';
}

function initCartCountSync() {
  syncMobileCartCount();
  const desktop = document.getElementById('cartCount');
  if (!desktop) return;
  new MutationObserver(syncMobileCartCount).observe(desktop, { childList: true, characterData: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  if (typeof updateCartCount === 'function') updateCartCount();
  if (typeof renderCart === 'function') renderCart();

  initCartCountSync();
  initCatalog();
  initDeliveryFilters();
  updateOfferControls();
  document.getElementById('offersSlider')?.addEventListener('scroll', updateOfferControls, { passive: true });
});
