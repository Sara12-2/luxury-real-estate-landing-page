/* ============================================================
   LUXESTATE — main.js
   All interactivity, no inline scripts in HTML.
   ============================================================ */

'use strict';

/* ── Currency Configuration ───────────────────────────────── */
const CURRENCY_CONFIG = {
  USD: { symbol: '$', rate: 1,      label: 'USD' },
  AED: { symbol: 'AED ', rate: 3.67, label: 'AED' },
  GBP: { symbol: '£',  rate: 0.79, label: 'GBP' },
};

let activeCurrency = 'USD';

/* ── Property Data ────────────────────────────────────────── */
const properties = [
  {
    id: 1,
    title: 'Sunset Palm Villa',
    priceUSD: 2800000,
    location: 'Palm Jumeirah, Dubai',
    city: 'dubai',
    type: 'Villa',
    budget: '1m-3m',
    beds: 5,
    baths: 6,
    sqft: 4500,
    image: 'https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Stunning beachfront villa with a private pool, panoramic ocean views, and premium finishes throughout. Features full smart home integration and professionally landscaped gardens.',
    features: [
      'Private Beach Access', 'Infinity Pool', 'Home Cinema',
      'Smart Home System', 'Landscaped Gardens', 'Private Parking',
    ],
  },
  {
    id: 2,
    title: 'Manhattan Sky Penthouse',
    priceUSD: 4200000,
    location: 'Manhattan, NYC, USA',
    city: 'new york',
    type: 'Apartment',
    budget: '3m+',
    beds: 4,
    baths: 4.5,
    sqft: 3200,
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Luxurious penthouse with panoramic city skyline views, floor-to-ceiling windows, and exclusive amenities in the heart of Manhattan. A New York icon.',
    features: [
      'Sky Lounge', 'Concierge Service', 'Fitness Center',
      'Rooftop Terrace', 'Private Elevator', 'Smart Home',
    ],
  },
  {
    id: 3,
    title: 'Knightsbridge Estate',
    priceUSD: 6460000,
    location: 'Knightsbridge, London, UK',
    city: 'london',
    type: 'Luxury Home',
    budget: '3m+',
    beds: 6,
    baths: 7,
    sqft: 6200,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'An elegant Victorian mansion in prestigious Knightsbridge, seamlessly blending original period details with contemporary luxury amenities.',
    features: [
      'Private Garden', 'Wine Cellar', 'Home Office',
      'Security System', 'Staff Quarters', 'Swimming Pool',
    ],
  },
  {
    id: 4,
    title: 'Dubai Marina Residences',
    priceUSD: 850000,
    location: 'Dubai Marina, Dubai',
    city: 'dubai',
    type: 'Apartment',
    budget: '500k-1m',
    beds: 2,
    baths: 2,
    sqft: 1400,
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Contemporary apartment with stunning marina views, premium appliances, and access to world-class building amenities — the perfect Dubai lifestyle.',
    features: [
      'Marina Views', 'Shared Pool', 'Gym Access',
      'Covered Parking', 'Concierge', '24/7 Security',
    ],
  },
  {
    id: 5,
    title: 'Mayfair Commercial Suite',
    priceUSD: 1750000,
    location: 'Mayfair, London, UK',
    city: 'london',
    type: 'Commercial',
    budget: '1m-3m',
    beds: 0,
    baths: 2,
    sqft: 2800,
    image: 'https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Prestigious office suite in the heart of Mayfair — ideal for financial services, law firms, or luxury retail. Grade A specification throughout.',
    features: [
      'Prime Location', 'Reception Area', 'Meeting Rooms',
      'Secure Entry', 'Bike Storage', 'EV Charging',
    ],
  },
  {
    id: 6,
    title: 'Hamptons Luxury Retreat',
    priceUSD: 5900000,
    location: 'The Hamptons, NY, USA',
    city: 'new york',
    type: 'Luxury Home',
    budget: '3m+',
    beds: 7,
    baths: 8,
    sqft: 7800,
    image: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Sprawling Hamptons estate offering unrivalled privacy, ocean breezes, and resort-style amenities set on two acres of manicured grounds.',
    features: [
      'Heated Pool', 'Tennis Court', 'Guest House',
      'Chef\'s Kitchen', 'Home Theater', 'Private Dock',
    ],
  },
];

/* ── Wishlist State ───────────────────────────────────────── */
let wishlist = new Set();

/* ── Utility: format price ────────────────────────────────── */
function formatPrice(usd, currency = activeCurrency) {
  const cfg = CURRENCY_CONFIG[currency];
  const amount = usd * cfg.rate;
  if (amount >= 1_000_000) {
    return cfg.symbol + (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  }
  return cfg.symbol + Math.round(amount).toLocaleString();
}

/* ── Utility: debounce ────────────────────────────────────── */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ── Utility: safe localStorage ──────────────────────────── */
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
};

/* ── Render Properties ────────────────────────────────────── */
function renderProperties(list = properties) {
  const container = document.getElementById('propertiesContainer');
  const emptyState = document.getElementById('emptyState');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  container.innerHTML = list.map(prop => {
    const isSaved = wishlist.has(prop.id);
    const priceDisplay = formatPrice(prop.priceUSD);
    const bedsLabel = prop.beds > 0 ? `<span><i class="fas fa-bed" aria-hidden="true"></i> ${prop.beds} Beds</span>` : '<span><i class="fas fa-briefcase" aria-hidden="true"></i> Commercial</span>';

    return `
      <article class="bg-white rounded-2xl overflow-hidden card-shadow hover-lift property-card reveal"
        onclick="openPropertyModal(${prop.id})"
        role="button"
        tabindex="0"
        aria-label="View details for ${prop.title}"
        onkeydown="if(event.key==='Enter'||event.key===' '){openPropertyModal(${prop.id})}">
        <div class="overflow-hidden h-56 relative">
          <img src="${prop.image}" alt="${prop.title}" class="property-img w-full h-full object-cover" loading="lazy">
          <button class="wishlist-btn${isSaved ? ' saved' : ''}"
            onclick="event.stopPropagation(); toggleWishlist(${prop.id})"
            aria-label="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}"
            aria-pressed="${isSaved}"
            id="wishlist-btn-${prop.id}">
            <i class="${isSaved ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
          </button>
          <span class="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            ${prop.type}
          </span>
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start gap-2">
            <h3 class="text-xl font-bold text-gray-800">${prop.title}</h3>
            <span class="text-[#d4af37] font-bold text-lg whitespace-nowrap property-price" data-usd="${prop.priceUSD}">${priceDisplay}</span>
          </div>
          <p class="text-gray-500 text-sm mt-1"><i class="fas fa-map-marker-alt mr-1" aria-hidden="true"></i> ${prop.location}</p>
          <div class="flex justify-between mt-3 text-gray-600 text-sm">
            ${bedsLabel}
            <span><i class="fas fa-bath" aria-hidden="true"></i> ${prop.baths} Baths</span>
            <span><i class="fas fa-arrows-alt" aria-hidden="true"></i> ${prop.sqft.toLocaleString()} sqft</span>
          </div>
          <button class="mt-5 w-full py-2.5 border-2 border-[#d4af37] text-[#d4af37] rounded-xl font-medium hover:bg-[#d4af37] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            onclick="event.stopPropagation(); openPropertyModal(${prop.id})"
            aria-label="View details for ${prop.title}">
            <i class="fas fa-eye mr-2" aria-hidden="true"></i> View Details
          </button>
        </div>
      </article>`;
  }).join('');

  // Trigger reveal animation for newly rendered cards
  requestAnimationFrame(() => {
    container.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  });
}

/* ── Filter Logic ─────────────────────────────────────────── */
function getFilterValues() {
  return {
    location: (document.getElementById('searchLocation')?.value || '').toLowerCase().trim(),
    type: document.getElementById('propertyType')?.value || '',
    budget: document.getElementById('budgetRange')?.value || '',
    chip: document.querySelector('.filter-chip.active')?.dataset.filter || 'all',
  };
}

function filterProperties() {
  const { location, type, budget, chip } = getFilterValues();

  const filtered = properties.filter(prop => {
    // Location text match (city or location string)
    if (location && !prop.location.toLowerCase().includes(location) && !prop.city.includes(location)) {
      return false;
    }
    // Property type from dropdown
    if (type && prop.type !== type) return false;

    // Budget range
    if (budget) {
      if (budget === '500k-1m' && (prop.priceUSD < 500000 || prop.priceUSD > 1000000)) return false;
      if (budget === '1m-3m' && (prop.priceUSD < 1000000 || prop.priceUSD > 3000000)) return false;
      if (budget === '3m+' && prop.priceUSD < 3000000) return false;
    }

    // Category chip / filter bar
    if (chip !== 'all' && prop.type !== chip) return false;

    return true;
  });

  renderProperties(filtered);
}

const debouncedFilter = debounce(filterProperties, 280);

/* ── Filter Chips ─────────────────────────────────────────── */
function initFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterProperties();
    });
  });

  // Category pills in the browse section
  document.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      // Sync with filter chips
      document.querySelectorAll('.filter-chip').forEach(chip => {
        const isMatch = chip.dataset.filter === filter;
        chip.classList.toggle('active', isMatch);
        chip.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
      filterProperties();
      // Scroll to properties
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('resetFilters')?.addEventListener('click', () => {
    document.getElementById('searchLocation').value = '';
    document.getElementById('propertyType').value = '';
    document.getElementById('budgetRange').value = '';
    document.querySelectorAll('.filter-chip').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    const allChip = document.querySelector('.filter-chip[data-filter="all"]');
    if (allChip) {
      allChip.classList.add('active');
      allChip.setAttribute('aria-pressed', 'true');
    }
    renderProperties();
  });
}

/* ── Wishlist ─────────────────────────────────────────────── */
function toggleWishlist(id) {
  const isSaved = wishlist.has(id);
  const btn = document.getElementById(`wishlist-btn-${id}`);
  const prop = properties.find(p => p.id === id);

  if (isSaved) {
    wishlist.delete(id);
    if (btn) {
      btn.classList.remove('saved');
      btn.querySelector('i').className = 'far fa-heart';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Save to wishlist');
    }
    showToast(`Removed "${prop.title}" from wishlist`);
  } else {
    wishlist.add(id);
    if (btn) {
      btn.classList.add('saved');
      btn.querySelector('i').className = 'fas fa-heart';
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Remove from wishlist');
    }
    showToast(`Saved "${prop.title}" to wishlist ❤️`);
  }
}

function showToast(msg) {
  const toast = document.getElementById('wishlistToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden', 'hiding');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.classList.add('hidden'), 320);
  }, 2800);
}

/* ── Property Modal ───────────────────────────────────────── */
let lastFocusedEl = null;

function openPropertyModal(id) {
  const property = properties.find(p => p.id === id);
  if (!property) return;

  lastFocusedEl = document.activeElement;

  const modal = document.getElementById('propertyModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.textContent = property.title;

  const priceDisplay = formatPrice(property.priceUSD);
  const isSaved = wishlist.has(property.id);
  const bedsRow = property.beds > 0
    ? `<div class="bg-gray-50 p-3 rounded-xl text-center"><i class="fas fa-bed text-[#d4af37] text-xl mb-1 block" aria-hidden="true"></i> <strong>${property.beds}</strong> Beds</div>`
    : '';

  modalContent.innerHTML = `
    <div class="modal-gallery">
      <img src="${property.image}" alt="${property.title} — exterior view">
    </div>

    <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
      <div>
        <span class="text-3xl font-bold text-[#d4af37] modal-price" data-usd="${property.priceUSD}">${priceDisplay}</span>
        <span class="ml-2 text-xs text-gray-400 uppercase tracking-wide">${activeCurrency}</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="toggleWishlistModal(${property.id})" id="modal-wishlist-btn"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all
            ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400'}">
          <i class="${isSaved ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
          ${isSaved ? 'Saved' : 'Save'}
        </button>
        <span class="text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
          <i class="fas fa-map-marker-alt mr-1 text-[#d4af37]" aria-hidden="true"></i> ${property.location}
        </span>
      </div>
    </div>

    <span class="inline-block bg-[#d4af37]/10 text-[#b3922c] text-xs font-semibold px-3 py-1 rounded-full mb-3">${property.type}</span>

    <p class="text-gray-600 mb-5 leading-relaxed">${property.description}</p>

    <div class="grid grid-cols-${property.beds > 0 ? '3' : '2'} gap-3 mb-5">
      ${bedsRow}
      <div class="bg-gray-50 p-3 rounded-xl text-center"><i class="fas fa-bath text-[#d4af37] text-xl mb-1 block" aria-hidden="true"></i> <strong>${property.baths}</strong> Baths</div>
      <div class="bg-gray-50 p-3 rounded-xl text-center"><i class="fas fa-arrows-alt text-[#d4af37] text-xl mb-1 block" aria-hidden="true"></i> <strong>${property.sqft.toLocaleString()}</strong> sqft</div>
    </div>

    <h4 class="font-bold mb-3 text-lg"><i class="fas fa-gem text-[#d4af37] mr-2" aria-hidden="true"></i>Key Features</h4>
    <div class="grid grid-cols-2 gap-2 mb-6">
      ${property.features.map(f => `
        <div class="flex items-center gap-2">
          <i class="fas fa-check-circle text-[#d4af37] text-sm flex-shrink-0" aria-hidden="true"></i>
          <span class="text-gray-600 text-sm">${f}</span>
        </div>`).join('')}
    </div>

    <div class="flex gap-3">
      <button onclick="closeAndSchedule('${property.title}')"
        class="flex-1 btn-gold text-white py-3 rounded-xl font-semibold">
        <i class="fas fa-calendar-alt mr-2" aria-hidden="true"></i> Schedule Viewing
      </button>
      <button onclick="closeModal()"
        class="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
        <i class="fas fa-times mr-2" aria-hidden="true"></i> Close
      </button>
    </div>
  `;

  modal.removeAttribute('hidden');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Trap focus in modal
  requestAnimationFrame(() => {
    const firstFocusable = modal.querySelector('button, [tabindex]');
    firstFocusable?.focus();
  });
}

function toggleWishlistModal(id) {
  toggleWishlist(id);
  const isSaved = wishlist.has(id);
  const btn = document.getElementById('modal-wishlist-btn');
  if (btn) {
    btn.className = `flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all
      ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400'}`;
    btn.querySelector('i').className = `${isSaved ? 'fas' : 'far'} fa-heart`;
    btn.childNodes[btn.childNodes.length - 1].textContent = isSaved ? ' Saved' : ' Save';
  }
}

function closeModal() {
  const modal = document.getElementById('propertyModal');
  modal.setAttribute('hidden', '');
  modal.style.display = '';
  document.body.style.overflow = '';
  lastFocusedEl?.focus();
}

function closeAndSchedule(propertyName) {
  closeModal();
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const msgField = document.getElementById('message');
  if (msgField) msgField.value = `I'm interested in ${propertyName}. Please contact me to arrange a viewing.`;
}

function scrollToContact(agentName) {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const msgField = document.getElementById('message');
  if (msgField) msgField.value = `I'd like to speak with ${agentName} about a property consultation.`;
}

/* Focus trap for modal */
function modalFocusTrap(e) {
  const modal = document.getElementById('propertyModal');
  if (modal.hasAttribute('hidden')) return;
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  if (e.key === 'Escape') closeModal();
}

/* ── Mobile Menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');

  function openMenu() {
    menu.removeAttribute('hidden');
    overlay.classList.add('visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeMenu() {
    menu.setAttribute('hidden', '');
    overlay.classList.remove('visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  }

  menuBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hasAttribute('hidden')) closeMenu();
  });
}

/* ── Currency Switcher ────────────────────────────────────── */
function initCurrencySwitcher() {
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.dataset.currency;
      if (currency === activeCurrency) return;

      activeCurrency = currency;

      // Update all buttons
      document.querySelectorAll('.currency-btn').forEach(b => {
        const isActive = b.dataset.currency === currency;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      // Update rendered prices in property grid
      document.querySelectorAll('.property-price').forEach(el => {
        const usd = parseFloat(el.dataset.usd);
        el.textContent = formatPrice(usd);
      });

      // Update modal price if open
      const modalPrice = document.querySelector('.modal-price');
      if (modalPrice) {
        const usd = parseFloat(modalPrice.dataset.usd);
        const cfg = CURRENCY_CONFIG[currency];
        modalPrice.textContent = formatPrice(usd);
        const labelEl = modalPrice.nextElementSibling;
        if (labelEl) labelEl.textContent = cfg.label;
      }

      // Update mortgage calculator symbol
      const symbol = CURRENCY_CONFIG[currency].symbol;
      const loanSymbol = document.getElementById('loanCurrencySymbol');
      if (loanSymbol) loanSymbol.textContent = symbol;

      calculateMortgage();
    });
  });
}

/* ── Progress Bar ─────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}

/* ── Back to Top ──────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Animated Counters (IntersectionObserver) ─────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ── Chart.js ─────────────────────────────────────────────── */
function initChart() {
  const canvas = document.getElementById('marketChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [{
        label: 'Avg Property Value ($M)',
        data: [1.2, 1.5, 1.8, 2.1, 2.6],
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212,175,55,0.08)',
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointBackgroundColor: '#d4af37',
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Inter' } } },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleFont: { family: 'Inter' },
          bodyFont: { family: 'Inter' },
          callbacks: {
            label: ctx => ` $${ctx.parsed.y}M avg value`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { callback: v => '$' + v + 'M', font: { family: 'Inter' } },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        x: {
          ticks: { font: { family: 'Inter' } },
          grid: { display: false },
        },
      },
    },
  });
}

/* ── Mortgage Calculator ──────────────────────────────────── */
function calculateMortgage() {
  const principal = parseFloat(document.getElementById('loanAmount')?.value) || 0;
  const annualRate = parseFloat(document.getElementById('interestRate')?.value) || 0;
  const years = parseInt(document.getElementById('loanTerm')?.value, 10) || 0;

  const cfg = CURRENCY_CONFIG[activeCurrency];
  const sym = cfg.symbol;
  const conv = cfg.rate;

  const monthlyEl = document.getElementById('monthlyPayment');
  const interestEl = document.getElementById('totalInterest');
  const totalEl = document.getElementById('totalAmount');

  if (!principal || !annualRate || !years) {
    [monthlyEl, interestEl, totalEl].forEach(el => { if (el) el.textContent = '—'; });
    return;
  }

  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - principal;

  function fmt(usd) {
    const val = usd * conv;
    if (val >= 1_000_000) return sym + (val / 1_000_000).toFixed(2) + 'M';
    return sym + Math.round(val).toLocaleString();
  }

  if (monthlyEl) monthlyEl.textContent = fmt(monthly) + '/mo';
  if (interestEl) interestEl.textContent = fmt(totalInterest);
  if (totalEl) totalEl.textContent = fmt(totalPaid);
}

function initMortgageCalculator() {
  ['loanAmount', 'interestRate', 'loanTerm'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateMortgage);
  });
  calculateMortgage();
}

/* ── Contact Form Validation ──────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errorId);
    field?.classList.add('invalid');
    err?.classList.remove('hidden');
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errorId);
    field?.classList.remove('invalid');
    err?.classList.add('hidden');
  }

  // Live validation
  document.getElementById('fullName')?.addEventListener('blur', () => {
    const val = document.getElementById('fullName').value.trim();
    val.length >= 2 ? clearError('fullName', 'fullNameError') : showError('fullName', 'fullNameError');
  });

  document.getElementById('email')?.addEventListener('blur', () => {
    const val = document.getElementById('email').value.trim();
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? clearError('email', 'emailError') : showError('email', 'emailError');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    let valid = true;

    if (name.length < 2) { showError('fullName', 'fullNameError'); valid = false; }
    else clearError('fullName', 'fullNameError');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'emailError'); valid = false; }
    else clearError('email', 'emailError');

    const successEl = document.getElementById('formSuccess');
    const errorEl = document.getElementById('formError');

    if (!valid) {
      errorEl.classList.remove('hidden');
      successEl.classList.add('hidden');
      return;
    }

    errorEl.classList.add('hidden');
    successEl.classList.remove('hidden');
    form.reset();
    setTimeout(() => successEl.classList.add('hidden'), 5000);
  });
}

/* ── Newsletter ───────────────────────────────────────────── */
function initNewsletter() {
  const btn = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterEmail');
  const msg = document.getElementById('newsletterMsg');
  if (!btn || !input || !msg) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = '✓ Subscribed! You\'ll receive our latest updates.';
      msg.className = 'text-xs mt-2 text-green-400';
      msg.classList.remove('hidden');
      input.value = '';
    } else {
      msg.textContent = '✗ Please enter a valid email address.';
      msg.className = 'text-xs mt-2 text-red-400';
      msg.classList.remove('hidden');
    }
    setTimeout(() => msg.classList.add('hidden'), 4000);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
}

/* ── Smooth Scrolling ─────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Hero Buttons ─────────────────────────────────────────── */
function initHeroButtons() {
  document.getElementById('exploreBtn')?.addEventListener('click', () => {
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('scheduleBtn')?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── Modal Events ─────────────────────────────────────────── */
function initModal() {
  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  document.getElementById('propertyModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('propertyModal')) closeModal();
  });
  document.addEventListener('keydown', modalFocusTrap);
}

/* ── Reveal on Scroll ─────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Cookie Consent ───────────────────────────────────────── */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (!storage.get('cookieConsent')) {
    // Show after short delay
    setTimeout(() => banner.classList.remove('hidden'), 1200);
  }

  document.getElementById('acceptCookies')?.addEventListener('click', () => {
    storage.set('cookieConsent', 'accepted');
    banner.classList.add('hidden');
  });

  document.getElementById('declineCookies')?.addEventListener('click', () => {
    storage.set('cookieConsent', 'declined');
    banner.classList.add('hidden');
  });
}

/* ── Search Inputs ────────────────────────────────────────── */
function initSearchInputs() {
  document.getElementById('searchLocation')?.addEventListener('input', debouncedFilter);
  document.getElementById('propertyType')?.addEventListener('change', filterProperties);
  document.getElementById('budgetRange')?.addEventListener('change', filterProperties);
}

/* ── Init All ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderProperties();
  initFilterChips();
  initMobileMenu();
  initCurrencySwitcher();
  initProgressBar();
  initBackToTop();
  initCounters();
  initChart();
  initMortgageCalculator();
  initContactForm();
  initNewsletter();
  initSmoothScroll();
  initHeroButtons();
  initModal();
  initReveal();
  initCookieConsent();
  initSearchInputs();
});
