import './style.css';
import { STOCK_DATA } from './data.js';
import { fetchCompanyWikipedia, generateHistoricalNewsTimeline } from './newsWikiService.js';

// Application State
const state = {
  currentView: 'categories', // 'categories', 'category-detail', 'all-stocks', 'buckets', 'sectors'
  selectedCategoryId: null,
  searchQuery: '',
  tierFilter: 'ALL',
  selectedCompany: null
};


// Lucide Icon Helper SVG map
const ICONS = {
  Landmark: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>`,
  Factory: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`,
  Activity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  Car: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  Cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  ShoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  FlaskConical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
  Pickaxe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-1.414-1.414l7.912-7.912"/><path d="M15.686 4.314A12.49 12.49 0 0 0 5.462 2.378l2.585 2.585A6.002 6.002 0 0 1 16 11l2.585 2.585a12.49 12.49 0 0 0-2.899-9.271z"/></svg>`,
  Zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  Tv: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  Building2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
  Layers: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L3.17 12.5"/><path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L3.17 17.5"/></svg>`,
  Building: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  Radio: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2"/></svg>`,
  Truck: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10z"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  Shirt: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  Film: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`,
  Search: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  ArrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  TrendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  ShieldAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
};

function getIcon(name) {
  return ICONS[name] || ICONS.Building2;
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  setupEvents();
});

function setupEvents() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      if (state.searchQuery && state.currentView !== 'all-stocks') {
        state.currentView = 'all-stocks';
        updateNavState();
      }
      renderMainContent();
    });
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetView = e.currentTarget.getAttribute('data-view');
      state.currentView = targetView;
      state.selectedCategoryId = null;
      updateNavState();
      renderMainContent();
    });
  });
}

function updateNavState() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-view') === state.currentView) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderApp() {
  renderMainContent();
}

function renderMainContent() {
  const container = document.getElementById('content-area');
  if (!container) return;

  if (state.searchQuery) {
    renderSearchResults(container);
    return;
  }

  switch (state.currentView) {
    case 'categories':
      renderCategoriesView(container);
      break;
    case 'category-detail':
      renderCategoryDetailView(container);
      break;
    case 'all-stocks':
      renderAllStocksView(container);
      break;
    case 'buckets':
      renderBucketsView(container);
      break;
    case 'sectors':
      renderSectorsView(container);
      break;
    default:
      renderCategoriesView(container);
  }
}

// 1. Categories Grid View
function renderCategoriesView(container) {
  const categoriesHtml = STOCK_DATA.categories.map(cat => `
    <div class="category-card" data-id="${cat.id}">
      <div>
        <div class="cat-header">
          <div class="cat-icon-badge">${getIcon(cat.icon)}</div>
          <span class="cat-count">${cat.count} companies</span>
        </div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-desc">${cat.description}</div>
      </div>
      <div class="cat-footer">
        <span>Explore companies & drivers</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="section-title-wrap">
      <h2 class="section-title">
        ${ICONS.Building2} Indian Stock Market Categories
      </h2>
      <span style="font-size:0.85rem; color:var(--text-muted);">17 Sectors • 500+ Companies</span>
    </div>
    <div class="categories-grid">
      ${categoriesHtml}
    </div>
  `;

  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedCategoryId = card.getAttribute('data-id');
      state.currentView = 'category-detail';
      renderMainContent();
    });
  });
}

// 2. Category Detail View
function renderCategoryDetailView(container) {
  const category = STOCK_DATA.categories.find(c => c.id === state.selectedCategoryId);
  if (!category) {
    state.currentView = 'categories';
    renderCategoriesView(container);
    return;
  }

  const categoryCompanies = STOCK_DATA.companies.filter(c => c.category === category.id);
  const filteredCompanies = categoryCompanies.filter(c => {
    if (state.tierFilter === 'ALL') return true;
    return c.tier === state.tierFilter;
  });

  container.innerHTML = `
    <button class="back-btn" id="back-to-cats">
      ${ICONS.ArrowLeft} Back to Categories
    </button>

    <div class="category-detail-header">
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:0.75rem;">
        <div class="cat-icon-badge" style="width:52px; height:52px;">${getIcon(category.icon)}</div>
        <div>
          <h1 style="font-size:1.6rem; font-weight:800;">${category.name}</h1>
          <p style="color:var(--text-muted); font-size:0.9rem;">${category.count} Companies mapped in Nifty 500</p>
        </div>
      </div>
      <p style="font-size:0.95rem; color:var(--text-main); margin-bottom:1rem;">${category.description}</p>

      <div class="driver-risk-grid">
        <div class="info-box info-box-driver">
          <div class="info-box-title" style="color:#10b981;">
            ${ICONS.TrendingUp} What Drives Earnings
          </div>
          <div style="color:var(--text-main);">${category.driver}</div>
        </div>
        <div class="info-box info-box-risk">
          <div class="info-box-title" style="color:#ef4444;">
            ${ICONS.ShieldAlert} Main Sector Risks
          </div>
          <div style="color:var(--text-main);">${category.risk}</div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted); margin-right:0.5rem;">Filter Tier:</span>
      ${['ALL', 'Strong', 'Good', 'Average', 'Risky'].map(tier => `
        <button class="filter-btn ${state.tierFilter === tier ? 'active' : ''}" data-tier="${tier}">
          ${tier === 'ALL' ? 'All Companies' : tier}
        </button>
      `).join('')}
    </div>

    <div class="company-table-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Primary Activity</th>
            <th>Investment Bucket</th>
            <th>Fundamental Rating</th>
            <th>P/E Ratio</th>
            <th>ROE (%)</th>
            <th>Debt Level</th>
            <th>5Y Sales Growth</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCompanies.map(comp => renderCompanyRow(comp)).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('back-to-cats').addEventListener('click', () => {
    state.currentView = 'categories';
    renderMainContent();
  });

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.tierFilter = e.currentTarget.getAttribute('data-tier');
      renderCategoryDetailView(container);
    });
  });

  attachCompanyRowEvents(container);
}

// 3. All Stocks View
function renderAllStocksView(container) {
  const filtered = STOCK_DATA.companies.filter(c => {
    if (state.tierFilter !== 'ALL' && c.tier !== state.tierFilter) return false;
    return true;
  });

  container.innerHTML = `
    <div class="section-title-wrap">
      <h2 class="section-title">
        ${ICONS.Landmark} Nifty 500 Master Company Directory (${filtered.length} companies)
      </h2>
    </div>

    <div class="filter-bar">
      <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted); margin-right:0.5rem;">Filter Rating:</span>
      ${['ALL', 'Strong', 'Good', 'Average', 'Risky'].map(tier => `
        <button class="filter-btn ${state.tierFilter === tier ? 'active' : ''}" data-tier="${tier}">
          ${tier === 'ALL' ? 'All Ratings' : tier}
        </button>
      `).join('')}
    </div>

    <div class="company-table-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Category / Sector</th>
            <th>Primary Activity</th>
            <th>Investment Bucket</th>
            <th>Rating</th>
            <th>P/E</th>
            <th>ROE</th>
            <th>Debt</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(comp => renderCompanyRow(comp, true)).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.tierFilter = e.currentTarget.getAttribute('data-tier');
      renderAllStocksView(container);
    });
  });

  attachCompanyRowEvents(container);
}

// 4. Investment Buckets View
function renderBucketsView(container) {
  container.innerHTML = `
    <div class="section-title-wrap" style="margin-bottom:1.5rem;">
      <div>
        <h2 class="section-title">Investment Framework: 5 Core Buckets</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.25rem;">
          How smart investors categorize the Nifty 500 based on business models, returns on equity & valuation risks.
        </p>
      </div>
    </div>

    <div class="buckets-grid">
      ${STOCK_DATA.investmentBuckets.map(b => `
        <div class="bucket-card" style="border-top: 4px solid var(--tier-${b.id === 'compounders' ? 'strong' : b.id === 'growth' ? 'good' : b.id === 'cyclical' ? 'average' : b.id === 'turnaround' ? 'good' : 'risky'})">
          <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.4rem;">
            ${b.badge}
          </div>
          <div class="bucket-header">${b.name}</div>
          <div class="bucket-criteria">${b.criteria}</div>
          <div style="font-weight:600; font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">Notable Examples:</div>
          <div class="bucket-examples">
            ${b.examples.map(ex => `<span class="example-tag">${ex}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. Sectors Weighting View
function renderSectorsView(container) {
  container.innerHTML = `
    <div class="section-title-wrap" style="margin-bottom:1.5rem;">
      <div>
        <h2 class="section-title">Nifty 500 Official Sector Distribution</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.25rem;">
          Financial Services dominates the Indian market landscape followed by Capital Goods and Healthcare.
        </p>
      </div>
    </div>

    <div class="company-table-container" style="padding:1.5rem;">
      <div style="display:flex; flex-direction:column; gap:1.2rem;">
        ${STOCK_DATA.nifty500Weights.map(sec => `
          <div>
            <div style="display:flex; justify-between; font-size:0.9rem; font-weight:600; margin-bottom:0.4rem;">
              <span>${sec.name}</span>
              <span style="color:var(--primary-accent);">${sec.weight}%</span>
            </div>
            <div style="background:rgba(255,255,255,0.05); height:12px; border-radius:6px; overflow:hidden;">
              <div style="width:${sec.weight * 3.5}%; max-width:100%; height:100%; background:${sec.color}; border-radius:6px; transition:width 0.6s ease;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Helper function to render table rows
function renderCompanyRow(comp, showCategory = false) {
  const cat = STOCK_DATA.categories.find(c => c.id === comp.category);
  const bucketObj = STOCK_DATA.investmentBuckets.find(b => b.id === comp.bucket);
  const tierClass = `badge-${comp.tier.toLowerCase()}`;

  return `
    <tr class="company-row" data-name="${comp.name}">
      <td class="company-name-cell">${comp.name}</td>
      ${showCategory ? `<td style="color:var(--text-muted); font-size:0.8rem;">${cat ? cat.name : comp.category}</td>` : ''}
      <td style="color:var(--text-muted);">${comp.detail}</td>
      <td>
        <span style="font-size:0.75rem; background:rgba(255,255,255,0.05); padding:0.2rem 0.5rem; border-radius:4px; color:var(--text-main);">
          ${bucketObj ? bucketObj.name : comp.bucket}
        </span>
      </td>
      <td><span class="badge-tier ${tierClass}">${comp.tier}</span></td>
      <td style="font-weight:600;">${comp.pe > 0 ? comp.pe : 'N/A'}</td>
      <td style="font-weight:600; color:${comp.roe > 15 ? '#10b981' : 'var(--text-main)'}">${comp.roe}%</td>
      <td style="color:var(--text-muted);">${comp.debt}</td>
      ${!showCategory ? `<td style="font-weight:600; color:#3b82f6;">${comp.growth5Y}</td>` : ''}
    </tr>
  `;
}

function attachCompanyRowEvents(container) {
  container.querySelectorAll('.company-row').forEach(row => {
    row.addEventListener('click', () => {
      const name = row.getAttribute('data-name');
      const company = STOCK_DATA.companies.find(c => c.name === name);
      if (company) {
        showCompanyModal(company);
      }
    });
  });
}

function renderSearchResults(container) {
  const query = state.searchQuery;
  const results = STOCK_DATA.companies.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.detail.toLowerCase().includes(query)
  );

  container.innerHTML = `
    <div class="section-title-wrap">
      <h2 class="section-title">
        ${ICONS.Search} Search Results for "${query}" (${results.length} found)
      </h2>
    </div>

    <div class="company-table-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Category / Sector</th>
            <th>Primary Activity</th>
            <th>Investment Bucket</th>
            <th>Rating</th>
            <th>P/E</th>
            <th>ROE</th>
          </tr>
        </thead>
        <tbody>
          ${results.length > 0 ? results.map(comp => renderCompanyRow(comp, true)).join('') : `
            <tr>
              <td colspan="7" style="text-align:center; padding:3rem; color:var(--text-muted);">
                No companies found matching "${query}". Try searching for another name or sector.
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;

  attachCompanyRowEvents(container);
}

async function showCompanyModal(comp) {
  const cat = STOCK_DATA.categories.find(c => c.id === comp.category);
  const bucketObj = STOCK_DATA.investmentBuckets.find(b => b.id === comp.bucket);
  const newsTimeline = generateHistoricalNewsTimeline(comp.name, comp.category);

  // Render initial modal state with loading spinner for Wikipedia
  const modalHtml = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal-content" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        <div style="font-size:0.8rem; font-weight:700; color:var(--primary-accent); text-transform:uppercase;">
          ${cat ? cat.name : ''}
        </div>
        <h2 style="font-size:1.6rem; font-weight:800; color:#fff; margin-top:0.25rem;">${comp.name}</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.25rem;">${comp.detail}</p>

        <div style="margin-top:1rem; display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
          <span class="badge-tier badge-${comp.tier.toLowerCase()}">Rating: ${comp.tier}</span>
          <span style="font-size:0.8rem; background:rgba(255,255,255,0.06); padding:0.2rem 0.6rem; border-radius:6px;">
            Bucket: ${bucketObj ? bucketObj.name : comp.bucket}
          </span>
        </div>

        <div class="modal-metrics-grid">
          <div class="metric-card">
            <div class="metric-label">P/E Ratio</div>
            <div class="metric-val">${comp.pe > 0 ? comp.pe : 'N/A'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Return on Equity (ROE)</div>
            <div class="metric-val" style="color:#10b981;">${comp.roe}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Debt Profile</div>
            <div class="metric-val">${comp.debt}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">5-Year Sales CAGR</div>
            <div class="metric-val" style="color:#3b82f6;">${comp.growth5Y}</div>
          </div>
        </div>

        <!-- Wikipedia & News Sections -->
        <div style="margin-top:1.5rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
          <h3 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
            📖 Wikipedia Overview
          </h3>
          <div id="wiki-content-box" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:10px; padding:1rem; font-size:0.875rem; color:var(--text-muted); line-height:1.6;">
            Loading Wikipedia historical profile...
          </div>
        </div>

        <div style="margin-top:1.5rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
          <h3 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            📰 10-Year News & Milestone Timeline
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.85rem; max-height:280px; overflow-y:auto; padding-right:0.4rem;">
            ${newsTimeline.map(item => `
              <div style="background:rgba(255,255,255,0.02); border-left:3px solid var(--primary-accent); border-radius:4px; padding:0.75rem 1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                  <span style="font-weight:700; font-size:0.8rem; color:var(--primary-accent);">${item.year}</span>
                  <span style="font-size:0.75rem; color:var(--text-dim);">${item.source}</span>
                </div>
                <div style="font-weight:600; font-size:0.875rem; color:#fff; margin-bottom:0.2rem;">${item.headline}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">${item.summary}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  // Fetch Wikipedia asynchronously
  const wikiData = await fetchCompanyWikipedia(comp.name);
  const wikiBox = document.getElementById('wiki-content-box');
  if (wikiBox) {
    wikiBox.innerHTML = `
      ${wikiData.thumbnail ? `<img src="${wikiData.thumbnail}" style="float:right; width:70px; height:auto; border-radius:6px; margin-left:1rem; margin-bottom:0.5rem;" />` : ''}
      <p style="margin-bottom:0.5rem;">${wikiData.extract}</p>
      <a href="${wikiData.url}" target="_blank" rel="noopener noreferrer" style="color:var(--primary-accent); font-weight:600; font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.25rem;">
        Read full article on Wikipedia ↗
      </a>
    `;
  }
}


function closeModal() {
  const modal = document.getElementById('modal-backdrop');
  if (modal) modal.remove();
}
