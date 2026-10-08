/**
 * ===================================================================
 * SMARTMECH AI — INTERACTIVE APPLICATION LOGIC (app.js)
 * Features:
 * - Multi-Step Interactive Booking Engine (Vehicle -> Services -> Tech -> Slots -> Quote)
 * - AI Symptom Diagnostics & Dynamic Cost Estimator
 * - Certified Mechanics Directory & Interactive Radar Map Pins
 * - Real-Time Service Tracker Simulator
 * - 24/7 Emergency Roadside SOS Modal & Dispatch
 * - LocalStorage Booking Persistence & "My Bookings" Drawer
 * - Dynamic Pricing & Coupon Engine (e.g. SMART20, SAVE15)
 * - Dark / Light Mode Switcher & Responsive Navigation
 * ===================================================================
 */

// --- DATA DEFINITIONS ---

const SERVICES_DATA = [
  {
    id: 'brake-pad',
    title: 'Ceramic Brake Pad & Rotor Service',
    category: 'brakes',
    price: 189,
    duration: '1.5 - 2 Hours',
    desc: 'Premium ceramic pads, rotor resurface/swap, brake hardware lube, and fluid check.',
    parts: 95,
    labor: 94,
    badge: 'Popular',
    icon: 'fa-disc-drive'
  },
  {
    id: 'oil-filter',
    title: 'Full Synthetic Oil & OEM Filter Service',
    category: 'maintenance',
    price: 89,
    duration: '45 Mins',
    desc: 'Up to 5 qts premium synthetic oil (Mobil-1/Castrol), OEM filter, and 45-point health inspection.',
    parts: 45,
    labor: 44,
    badge: 'Essential',
    icon: 'fa-oil-can'
  },
  {
    id: 'ai-diag',
    title: 'Comprehensive OBD-II Scanner & Multi-Point Diagnostic',
    category: 'diagnostics',
    price: 79,
    duration: '1 Hour',
    desc: 'Deep ECU module scan, live sensor telemetry, error code clearing, and technician physical inspection.',
    parts: 0,
    labor: 79,
    badge: 'AI Powered',
    icon: 'fa-microchip'
  },
  {
    id: 'battery',
    title: 'AGM Battery Testing & Heavy-Duty Replacement',
    category: 'electrical',
    price: 210,
    duration: '45 Mins',
    desc: 'Cold-crank amps testing, terminal corrosion cleanup, and brand-new AGM battery installation with 3-yr warranty.',
    parts: 155,
    labor: 55,
    badge: 'High Voltage',
    icon: 'fa-car-battery'
  },
  {
    id: 'ac-service',
    title: 'AC Climate Recharge & Cabin Leak Test',
    category: 'climate',
    price: 145,
    duration: '1 Hour',
    desc: 'R134a/R1234yf freon recharge, UV dye leak inspection, and compressor clutch performance check.',
    parts: 55,
    labor: 90,
    badge: 'Summer Ready',
    icon: 'fa-snowflake'
  },
  {
    id: 'spark-plugs',
    title: 'Iridium Spark Plugs & Ignition Coil Service',
    category: 'maintenance',
    price: 165,
    duration: '1.5 Hours',
    desc: 'Precision laser-iridium spark plugs, gap calibration, and cylinder misfire diagnostics.',
    parts: 75,
    labor: 90,
    badge: 'Performance',
    icon: 'fa-bolt'
  },
  {
    id: 'suspension',
    title: 'Struts, Shocks & Wheel Alignment Inspection',
    category: 'brakes',
    price: 240,
    duration: '2 Hours',
    desc: 'Front and rear dampener check, tie rod end testing, and laser steering geometry adjustment.',
    parts: 130,
    labor: 110,
    badge: 'Ride Quality',
    icon: 'fa-arrows-split-up-and-left'
  },
  {
    id: 'ev-diagnostic',
    title: 'EV High-Voltage Battery Pack & Thermal Health Scan',
    category: 'diagnostics',
    price: 129,
    duration: '1 Hour',
    desc: 'Cell-level voltage balance test, coolant pump telemetry, and regenerative braking check.',
    parts: 0,
    labor: 129,
    badge: 'EV Certified',
    icon: 'fa-charging-station'
  }
];

const MECHANICS_DATA = [
  {
    id: 'm1',
    name: 'Sarah Mitchell',
    role: 'ASE Master Certified Technician',
    experience: '9 Years Exp.',
    rating: 4.98,
    reviewsCount: 428,
    distance: '2.1 miles away',
    specialties: ['Brakes & Suspension', 'Diagnostics', 'EV & Hybrid'],
    avatar: 'assets/images/mechanic.jpg',
    availability: 'Available Today',
    vanId: 'Unit #04 (Ford Transit)',
    isMobile: true,
    isGarage: true,
    isEv: true,
    isEmergency: true,
    mapCoords: { top: 38, left: 42 }
  },
  {
    id: 'm2',
    name: 'Marcus Vance',
    role: 'Master Engine & Drivetrain Specialist',
    experience: '12 Years Exp.',
    rating: 4.94,
    reviewsCount: 612,
    distance: '3.4 miles away',
    specialties: ['Engine Diagnostics', 'Tune-ups', 'Transmission'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    availability: 'Next Slot: 11:30 AM',
    vanId: 'Unit #09 (Ram ProMaster)',
    isMobile: true,
    isGarage: false,
    isEv: false,
    isEmergency: true,
    mapCoords: { top: 25, left: 65 }
  },
  {
    id: 'm3',
    name: 'Apex Precision Garage (Bay 3)',
    role: 'Certified High-Capacity Workshop',
    experience: 'Partner Facility',
    rating: 4.96,
    reviewsCount: 884,
    distance: '1.8 miles away',
    specialties: ['Hydraulic Lift Bays', 'AC Recovery', 'Wheel Alignment'],
    avatar: 'assets/images/hero.jpg',
    availability: 'Immediate Drop-off',
    vanId: 'Bay #03 & #04',
    isMobile: false,
    isGarage: true,
    isEv: true,
    isEmergency: false,
    mapCoords: { top: 68, left: 35 }
  },
  {
    id: 'm4',
    name: 'David Chen',
    role: 'High-Voltage EV & Electrical Master',
    experience: '7 Years Exp.',
    rating: 4.99,
    reviewsCount: 310,
    distance: '4.2 miles away',
    specialties: ['Tesla / Rivian Certified', '12V & HV Systems', 'Sensors'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    availability: 'Today 2:00 PM',
    vanId: 'Unit #11 (Mobile EV Lab)',
    isMobile: true,
    isGarage: false,
    isEv: true,
    isEmergency: false,
    mapCoords: { top: 72, left: 62 }
  },
  {
    id: 'm5',
    name: 'Elena Rostova',
    role: 'Certified Brake & Chassis Tech',
    experience: '8 Years Exp.',
    rating: 4.91,
    reviewsCount: 275,
    distance: '2.9 miles away',
    specialties: ['Brembo / Performance Brakes', 'Rotors', 'Fluid Flush'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    availability: 'Available Today',
    vanId: 'Unit #02 (Mercedes Sprinter)',
    isMobile: true,
    isGarage: true,
    isEv: false,
    isEmergency: true,
    mapCoords: { top: 45, left: 78 }
  },
  {
    id: 'm6',
    name: 'Metro Tech Center (Bay 1)',
    role: 'Premier Auto Care Hub',
    experience: 'ASE Blue Seal Certified',
    rating: 4.88,
    reviewsCount: 520,
    distance: '3.1 miles away',
    specialties: ['Full Inspections', 'Factory Scheduled', 'Emissions'],
    avatar: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80',
    availability: 'Open 7am - 8pm',
    vanId: 'Bay Station SF-West',
    isMobile: false,
    isGarage: true,
    isEv: true,
    isEmergency: false,
    mapCoords: { top: 22, left: 24 }
  }
];

const SYMPTOM_DATABASE = {
  brake_squeak: {
    title: 'High-Pitched Squeal or Grinding When Braking',
    category: 'Brakes & Rotors',
    severity: 'Moderate',
    cause: 'Friction pad lining worn below 3mm; acoustic wear indicator rubbing rotor.',
    fix: 'Front Brake Pad & Rotor Replacement',
    cost: '$180 – $240',
    time: '1.5 - 2 Hours',
    serviceId: 'brake-pad'
  },
  brake_vibe: {
    title: 'Steering Wheel Shakes / Vibrates When Braking',
    category: 'Brakes & Rotors',
    severity: 'Moderate',
    cause: 'Heat-warped brake rotors with lateral runout causing pulsation.',
    fix: 'Brake Rotor Resurfacing or Dual Rotor Replacement',
    cost: '$210 – $290',
    time: '2 Hours',
    serviceId: 'brake-pad'
  },
  engine_light: {
    title: 'Check Engine Light Illuminated or Flashing',
    category: 'Engine Management',
    severity: 'High (If Flashing)',
    cause: 'Emissions or ignition anomaly (O2 sensor, EVAP leak, or cylinder misfire).',
    fix: 'OBD-II Deep Computer Diagnostic & Code Clearing',
    cost: '$79 – $145',
    time: '1 Hour',
    serviceId: 'ai-diag'
  },
  rough_idle: {
    title: 'Rough Idling or Stumble at Red Lights',
    category: 'Ignition / Fuel',
    severity: 'Moderate',
    cause: 'Carbon-fouled spark plugs, sticky throttle body, or vacuum leak.',
    fix: 'Iridium Spark Plugs & Intake Throttle Cleaning',
    cost: '$165 – $220',
    time: '1.5 Hours',
    serviceId: 'spark-plugs'
  },
  ac_warm: {
    title: 'Air Conditioning Blowing Warm / Ambient Air',
    category: 'Climate Control',
    severity: 'Low',
    cause: 'Low refrigerant pressure due to micro-leak or compressor clutch failure.',
    fix: 'AC System Recharge, UV Dye Test & Cabin Filter Swap',
    cost: '$145 – $210',
    time: '1 Hour',
    serviceId: 'ac-service'
  },
  battery_slow: {
    title: 'Slow Cranking or Rapid Clicking When Starting',
    category: 'Electrical',
    severity: 'High',
    cause: 'Depleted battery capacity, sulfated lead plates, or bad alternator diode.',
    fix: 'Heavy-Duty AGM Battery Swap & Terminal Anti-Corrosion',
    cost: '$190 – $240',
    time: '45 Mins',
    serviceId: 'battery'
  },
  fluid_leak: {
    title: 'Puddle or Fluid Drops Under Engine Bay',
    category: 'Fluids & Gaskets',
    severity: 'Moderate',
    cause: 'Worn oil drain plug washer, valve cover gasket, or coolant radiator hose seep.',
    fix: 'Leak Tracer Diagnostic & Oil Filter / Gasket Reseal',
    cost: '$110 – $180',
    time: '1 - 1.5 Hours',
    serviceId: 'oil-filter'
  },
  car_pull: {
    title: 'Car Pulls to Left or Right While Driving Straight',
    category: 'Steering & Suspension',
    severity: 'Moderate',
    cause: 'Uneven tire tread wear, misaligned toe angle, or worn tie-rod bushing.',
    fix: '4-Wheel Laser Alignment & Suspension Bushing Inspection',
    cost: '$130 – $190',
    time: '1.5 Hours',
    serviceId: 'suspension'
  },
  smoke_exhaust: {
    title: 'Blue or Thick White Smoke from Exhaust Tailpipe',
    category: 'Engine Internal',
    severity: 'Critical',
    cause: 'Oil bypass past piston rings/valve seals, or coolant intrusion into combustion chamber.',
    fix: 'Engine Compression & Cylinder Leakdown Test',
    cost: '$140 – $260',
    time: '2 Hours',
    serviceId: 'ai-diag'
  },
  belt_squeal: {
    title: 'Loud Screeching or Chirping from Under Hood',
    category: 'Belts & Pulleys',
    severity: 'Moderate',
    cause: 'Glazed serpentine drive belt or worn spring-loaded automatic belt tensioner.',
    fix: 'Serpentine Accessory Belt & Tensioner Pulley Replacement',
    cost: '$140 – $195',
    time: '1 Hour',
    serviceId: 'ai-diag'
  }
};

// --- APPLICATION STATE ---
const AppState = {
  currentStep: 1,
  vehicle: {
    year: '2022',
    make: 'Honda',
    model: 'Civic',
    fuel: 'Gasoline',
    mileage: '38500',
    plate: '',
    locationType: 'mobile'
  },
  selectedServices: ['oil-filter'], // default selection
  selectedMechanicId: 'm1',
  selectedDate: null,
  selectedSlot: '08:30 AM',
  customer: {
    name: 'Alex Rivera',
    phone: '(415) 890-3421',
    email: 'alex.rivera@example.com',
    address: '742 Evergreen Terrace, San Francisco, CA'
  },
  couponCode: 'SMART20',
  discountAmount: 20,
  activeBookings: [],
  trackerStep: 2,
  theme: 'dark'
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadBookingsFromStorage();
  initNavigation();
  initVehiclePresets();
  renderServicesGrid('all');
  renderMechanicsSelection();
  renderMechanicsDirectory('all');
  initDatePicker();
  initSlotPicker();
  initCouponEngine();
  initStepNavigation();
  initDiagnosticsTool();
  initMapToggle();
  initTrackerSimulation();
  initSosModal();
  initPartnerCalculator();
  initQuickBookingSearch();
  updatePricingCalculation();
  updateBookingsBadge();
});

// --- THEME SYSTEM ---
function initTheme() {
  const savedTheme = localStorage.getItem('smartmech_theme') || 'dark';
  AppState.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', AppState.theme);
      localStorage.setItem('smartmech_theme', AppState.theme);
      showToast(`Switched to ${AppState.theme} mode`, 'info');
    });
  }
}

// --- NAVIGATION & DRAWER ---
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const announcementBar = document.getElementById('announcementBar');
  const closeAnnouncement = document.getElementById('closeAnnouncement');

  if (mobileMenuBtn && mobileDrawer && drawerBackdrop) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
    };

    drawerClose?.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  if (closeAnnouncement && announcementBar) {
    closeAnnouncement.addEventListener('click', () => {
      announcementBar.style.display = 'none';
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// --- QUICK BOOKING SEARCH (HERO) ---
function initQuickBookingSearch() {
  const chips = document.querySelectorAll('#vehicleTypeChips .type-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const type = chip.dataset.type;
      const vehicleInput = document.getElementById('quickVehicleInput');
      if (type === 'electric') vehicleInput.value = '2023 Tesla Model 3';
      else if (type === 'suv') vehicleInput.value = '2022 Toyota RAV4';
      else if (type === 'truck') vehicleInput.value = '2021 Ford F-150';
      else vehicleInput.value = '2022 Honda Civic';
    });
  });

  const detectLocationBtn = document.getElementById('detectLocationBtn');
  if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', () => {
      const zipInput = document.getElementById('quickZipInput');
      zipInput.value = 'San Francisco, CA (GPS Active)';
      showToast('Detected current location: San Francisco, CA', 'success');
    });
  }

  const quickBookActionBtn = document.getElementById('quickBookActionBtn');
  if (quickBookActionBtn) {
    quickBookActionBtn.addEventListener('click', () => {
      const vehicleVal = document.getElementById('quickVehicleInput').value.trim();
      const serviceVal = document.getElementById('quickServiceSelect').value;
      if (vehicleVal) {
        AppState.vehicle.model = vehicleVal;
        document.getElementById('vehicleModel').value = vehicleVal;
      }
      if (serviceVal && !AppState.selectedServices.includes(serviceVal)) {
        AppState.selectedServices = [serviceVal];
        renderServicesGrid();
      }
      goToStep(2);
      document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
      showToast('Matched your vehicle and selected service!', 'info');
    });
  }

  const heroBookFastBtn = document.getElementById('heroBookFastBtn');
  if (heroBookFastBtn) {
    heroBookFastBtn.addEventListener('click', () => {
      AppState.selectedMechanicId = 'm1';
      renderMechanicsSelection();
      goToStep(3);
      document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
      showToast('Selected Master Mechanic Sarah Mitchell', 'success');
    });
  }
}

// --- VEHICLE PRESETS ---
function initVehiclePresets() {
  const presetPills = document.querySelectorAll('.preset-pill');
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const make = pill.dataset.make;
      const model = pill.dataset.model;
      const year = pill.dataset.year;
      const fuel = pill.dataset.fuel;

      document.getElementById('vehicleYear').value = year;
      document.getElementById('vehicleMake').value = make;
      document.getElementById('vehicleModel').value = model;

      let powertrain = 'Gasoline';
      if (fuel === 'hybrid') powertrain = 'Hybrid';
      if (fuel === 'ev') powertrain = 'Electric';
      document.getElementById('vehiclePowertrain').value = powertrain;

      AppState.vehicle.year = year;
      AppState.vehicle.make = make;
      AppState.vehicle.model = model;
      AppState.vehicle.fuel = powertrain;

      showToast(`Selected preset: ${year} ${make} ${model}`, 'info');
    });
  });

  // Location preference radio cards
  const prefMobile = document.getElementById('prefMobileOption');
  const prefGarage = document.getElementById('prefGarageOption');

  if (prefMobile && prefGarage) {
    prefMobile.addEventListener('click', () => {
      prefMobile.classList.add('active');
      prefGarage.classList.remove('active');
      prefMobile.querySelector('input').checked = true;
      AppState.vehicle.locationType = 'mobile';
      updateSummaryDisplay();
    });

    prefGarage.addEventListener('click', () => {
      prefGarage.classList.add('active');
      prefMobile.classList.remove('active');
      prefGarage.querySelector('input').checked = true;
      AppState.vehicle.locationType = 'garage';
      updateSummaryDisplay();
    });
  }
}

// --- SERVICES GRID & SELECTION ---
function renderServicesGrid(filterCategory = 'all') {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const filtered = filterCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === filterCategory);

  grid.innerHTML = filtered.map(service => {
    const isSelected = AppState.selectedServices.includes(service.id);
    return `
      <div class="service-item-card ${isSelected ? 'selected' : ''}" data-service-id="${service.id}">
        <input type="checkbox" class="service-check" ${isSelected ? 'checked' : ''} aria-label="Select ${service.title}">
        <div class="service-info">
          <div class="service-title-row">
            <span class="service-title">${service.title}</span>
            <span class="service-price">$${service.price}</span>
          </div>
          <p class="service-desc">${service.desc}</p>
          <div class="service-meta-tags">
            <span class="service-tag-mini"><i class="fa-solid fa-clock"></i> ${service.duration}</span>
            <span class="badge-pill">${service.badge}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card click handlers
  grid.querySelectorAll('.service-item-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const serviceId = card.dataset.serviceId;
      const checkbox = card.querySelector('.service-check');
      
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      if (checkbox.checked) {
        if (!AppState.selectedServices.includes(serviceId)) {
          AppState.selectedServices.push(serviceId);
        }
        card.classList.add('selected');
      } else {
        AppState.selectedServices = AppState.selectedServices.filter(id => id !== serviceId);
        card.classList.remove('selected');
      }

      updatePricingCalculation();
      updateSummaryDisplay();
    });
  });

  // Filter tabs
  const tabs = document.querySelectorAll('#serviceCategoryTabs .cat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderServicesGrid(tab.dataset.cat);
    });
  });
}

// --- MECHANICS SELECTION (WIZARD STEP 3) ---
function renderMechanicsSelection() {
  const container = document.getElementById('mechanicsSelectionGrid');
  if (!container) return;

  container.innerHTML = MECHANICS_DATA.map(mech => {
    const isSelected = AppState.selectedMechanicId === mech.id;
    return `
      <div class="tech-select-card ${isSelected ? 'selected' : ''}" data-mech-id="${mech.id}">
        <div class="tech-top-meta">
          <img src="${mech.avatar}" alt="${mech.name}" class="tech-card-img" onerror="this.src='assets/images/mechanic.jpg'">
          <div class="tech-name-col">
            <h4>${mech.name}</h4>
            <div class="tech-rating-row">
              <span class="star-gold">★ ${mech.rating}</span>
              <span class="text-muted">(${mech.reviewsCount} jobs)</span>
            </div>
          </div>
        </div>
        <div class="tech-specs-list">
          <div><i class="fa-solid fa-certificate text-gold"></i> ${mech.role}</div>
          <div><i class="fa-solid fa-location-dot"></i> ${mech.distance}</div>
          <div><i class="fa-solid fa-van-shuttle"></i> ${mech.vanId}</div>
        </div>
        <div class="tech-card-bottom">
          <span class="tech-status-dot"><span class="dot-green"></span> ${mech.availability}</span>
          <span class="badge-pill">${mech.isMobile ? 'Mobile Van' : 'Workshop Bay'}</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.tech-select-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.tech-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      AppState.selectedMechanicId = card.dataset.mechId;
      updateSummaryDisplay();
      const tech = MECHANICS_DATA.find(m => m.id === AppState.selectedMechanicId);
      if (tech) showToast(`Technician selected: ${tech.name}`, 'info');
    });
  });
}

// --- MECHANICS DIRECTORY (MAIN PAGE SECTION) ---
function renderMechanicsDirectory(filter = 'all') {
  const container = document.getElementById('mechanicsDirectoryGrid');
  const mapPinsLayer = document.getElementById('mapPinsLayer');
  if (!container) return;

  let filtered = MECHANICS_DATA;
  if (filter === 'mobile') filtered = MECHANICS_DATA.filter(m => m.isMobile);
  if (filter === 'garage') filtered = MECHANICS_DATA.filter(m => m.isGarage);
  if (filter === 'ev') filtered = MECHANICS_DATA.filter(m => m.isEv);
  if (filter === 'emergency') filtered = MECHANICS_DATA.filter(m => m.isEmergency);

  container.innerHTML = filtered.map(mech => `
    <div class="directory-tech-card" id="dir-mech-${mech.id}">
      <div class="dtc-header">
        <img src="${mech.avatar}" alt="${mech.name}" class="dtc-avatar" onerror="this.src='assets/images/mechanic.jpg'">
        <div class="dtc-title-col">
          <h4>${mech.name}</h4>
          <span class="dtc-cert">${mech.role}</span>
          <div class="dtc-rating">
            <i class="fa-solid fa-star"></i>
            <strong>${mech.rating}</strong>
            <span>(${mech.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>
      <div class="dtc-stats">
        <div><span>Experience</span><strong>${mech.experience}</strong></div>
        <div><span>Proximity</span><strong>${mech.distance}</strong></div>
      </div>
      <div class="dtc-tags">
        ${mech.specialties.map(s => `<span class="dtc-tag">${s}</span>`).join('')}
      </div>
      <div class="dtc-actions">
        <button type="button" class="btn btn-sm btn-outline full-width dir-book-btn" data-mech-id="${mech.id}">
          <i class="fa-solid fa-calendar-plus"></i> Book This Mechanic
        </button>
      </div>
    </div>
  `).join('');

  // Attach direct book clicks
  container.querySelectorAll('.dir-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mechId = btn.dataset.mechId;
      AppState.selectedMechanicId = mechId;
      renderMechanicsSelection();
      goToStep(3);
      document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected ${MECHANICS_DATA.find(m => m.id === mechId)?.name}`, 'success');
    });
  });

  // Render map pins
  if (mapPinsLayer) {
    mapPinsLayer.innerHTML = filtered.map(mech => `
      <div class="mechanic-pin" style="top: ${mech.mapCoords.top}%; left: ${mech.mapCoords.left}%;" data-mech-id="${mech.id}">
        <div class="mech-pin-badge">
          <i class="fa-solid ${mech.isMobile ? 'fa-van-shuttle' : 'fa-warehouse'}"></i> ${mech.name.split(' ')[0]}
        </div>
      </div>
    `).join('');

    mapPinsLayer.querySelectorAll('.mechanic-pin').forEach(pin => {
      pin.addEventListener('click', () => {
        const mechId = pin.dataset.mechId;
        const mech = MECHANICS_DATA.find(m => m.id === mechId);
        if (mech) {
          const cardName = document.getElementById('mapCardName');
          const cardDist = document.getElementById('mapCardDist');
          const cardRating = document.getElementById('mapCardRating');
          const mapBookBtn = document.getElementById('mapBookBtn');

          if (cardName) cardName.textContent = mech.name;
          if (cardDist) cardDist.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${mech.distance}`;
          if (cardRating) cardRating.textContent = `★ ${mech.rating} (${mech.reviewsCount} reviews)`;

          if (mapBookBtn) {
            mapBookBtn.onclick = () => {
              AppState.selectedMechanicId = mech.id;
              renderMechanicsSelection();
              goToStep(3);
              document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
            };
          }

          mapPinsLayer.querySelectorAll('.mechanic-pin').forEach(p => p.classList.remove('active'));
          pin.classList.add('active');
        }
      });
    });
  }

  // Filter toolbar button handling
  const filterBtns = document.querySelectorAll('#directoryFilters .dir-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMechanicsDirectory(btn.dataset.filter);
    });
  });
}

// --- RADAR MAP VIEW TOGGLE ---
function initMapToggle() {
  const viewListBtn = document.getElementById('viewListBtn');
  const viewMapBtn = document.getElementById('viewMapBtn');
  const mapView = document.getElementById('mapViewContainer');
  const gridView = document.getElementById('mechanicsDirectoryGrid');

  if (viewListBtn && viewMapBtn && mapView && gridView) {
    viewListBtn.addEventListener('click', () => {
      viewListBtn.classList.add('active');
      viewMapBtn.classList.remove('active');
      mapView.style.display = 'none';
      gridView.style.display = 'grid';
    });

    viewMapBtn.addEventListener('click', () => {
      viewMapBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      mapView.style.display = 'block';
      gridView.style.display = 'none';
    });
  }
}

// --- DATE PICKER (NEXT 7 DAYS) ---
function initDatePicker() {
  const scrollContainer = document.getElementById('datePickerScroll');
  if (!scrollContainer) return;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  let datesHtml = '';

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayName = i === 0 ? 'Today' : (i === 1 ? 'Tmw' : daysOfWeek[date.getDay()]);
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const isSelected = i === 1; // Default to Tomorrow

    const dateString = `${dayName}, ${monthName} ${dayNum}`;
    if (isSelected) AppState.selectedDate = dateString;

    datesHtml += `
      <div class="date-chip ${isSelected ? 'active' : ''}" data-date-str="${dateString}">
        <span class="d-day">${dayName}</span>
        <span class="d-num">${dayNum}</span>
        <span class="d-month">${monthName}</span>
      </div>
    `;
  }

  scrollContainer.innerHTML = datesHtml;

  scrollContainer.querySelectorAll('.date-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      scrollContainer.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.selectedDate = chip.dataset.dateStr;
      updateSummaryDisplay();
      showToast(`Selected date: ${AppState.selectedDate}`, 'info');
    });
  });
}

// --- TIME SLOT PICKER ---
function initSlotPicker() {
  const slotButtons = document.querySelectorAll('.slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.selectedSlot = btn.dataset.time;
      updateSummaryDisplay();
      updatePricingCalculation();
      showToast(`Selected slot: ${AppState.selectedSlot}`, 'info');
    });
  });
}

// --- STEP NAVIGATION & VALIDATION ---
function initStepNavigation() {
  // Stepper circle clicks
  document.querySelectorAll('.wizard-stepper .step-item').forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step, 10);
      if (step <= AppState.currentStep || step === AppState.currentStep + 1) {
        goToStep(step);
      }
    });
  });

  // Next buttons
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next, 10);
      if (validateCurrentStep(AppState.currentStep)) {
        goToStep(nextStep);
      }
    });
  });

  // Back buttons
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev, 10);
      goToStep(prevStep);
    });
  });

  // Confirm booking
  const confirmBtn = document.getElementById('confirmBookingBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      processBookingConfirmation();
    });
  }

  // Book another service
  const bookAnotherBtn = document.getElementById('bookAnotherBtn');
  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }

  // Open live tracker from success
  const trackCurrentBtn = document.getElementById('trackCurrentBookingBtn');
  if (trackCurrentBtn) {
    trackCurrentBtn.addEventListener('click', () => {
      document.getElementById('trackerSection').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function validateCurrentStep(step) {
  if (step === 1) {
    const make = document.getElementById('vehicleMake')?.value;
    const model = document.getElementById('vehicleModel')?.value.trim();
    if (!model) {
      showToast('Please specify your vehicle model.', 'warning');
      return false;
    }
    AppState.vehicle.year = document.getElementById('vehicleYear')?.value;
    AppState.vehicle.make = make;
    AppState.vehicle.model = model;
    AppState.vehicle.fuel = document.getElementById('vehiclePowertrain')?.value;
    AppState.vehicle.mileage = document.getElementById('vehicleMileage')?.value;
    AppState.vehicle.plate = document.getElementById('vehicleLicense')?.value;
    return true;
  }

  if (step === 2) {
    if (AppState.selectedServices.length === 0) {
      showToast('Please select at least one required service.', 'warning');
      return false;
    }
    return true;
  }

  if (step === 3) {
    if (!AppState.selectedMechanicId) {
      showToast('Please select a technician.', 'warning');
      return false;
    }
    return true;
  }

  if (step === 4) {
    const name = document.getElementById('customerFullName')?.value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim();
    const email = document.getElementById('customerEmail')?.value.trim();
    const address = document.getElementById('customerAddress')?.value.trim();

    if (!name || !phone || !address) {
      showToast('Please fill in your name, contact phone, and address.', 'warning');
      return false;
    }

    AppState.customer = { name, phone, email, address };
    return true;
  }

  return true;
}

function goToStep(stepNum) {
  AppState.currentStep = stepNum;

  // Update stepper UI
  document.querySelectorAll('.wizard-stepper .step-item').forEach(item => {
    const s = parseInt(item.dataset.step, 10);
    item.classList.remove('active', 'completed');
    if (s < stepNum) {
      item.classList.add('completed');
    } else if (s === stepNum) {
      item.classList.add('active');
    }
  });

  // Update step lines
  document.querySelectorAll('.wizard-stepper .step-line').forEach((line, index) => {
    if (index + 1 < stepNum) {
      line.classList.add('active');
    } else {
      line.classList.remove('active');
    }
  });

  // Show corresponding pane
  document.querySelectorAll('.wizard-step-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  if (stepNum <= 5) {
    const activePane = document.getElementById(`wizardStep${stepNum}`);
    if (activePane) activePane.classList.add('active');
  }

  if (stepNum === 5) {
    updateSummaryDisplay();
    updatePricingCalculation();
  }
}

// --- PRICING & SUMMARY ENGINE ---
function updatePricingCalculation() {
  let laborTotal = 0;
  let partsTotal = 0;

  AppState.selectedServices.forEach(sId => {
    const service = SERVICES_DATA.find(s => s.id === sId);
    if (service) {
      laborTotal += service.labor;
      partsTotal += service.parts;
    }
  });

  // Priority fee check
  if (AppState.selectedSlot && AppState.selectedSlot.includes('ASAP')) {
    laborTotal += 15;
  }

  const environmental = partsTotal > 0 ? 12.50 : 0;
  let subtotal = laborTotal + partsTotal + environmental;
  let final = Math.max(0, subtotal - AppState.discountAmount);

  const priceLabor = document.getElementById('priceLabor');
  const priceParts = document.getElementById('priceParts');
  const priceEnv = document.getElementById('priceEnvironmental');
  const priceDisc = document.getElementById('priceDiscount');
  const discountRow = document.getElementById('discountRow');
  const finalTotal = document.getElementById('finalTotal');

  if (priceLabor) priceLabor.textContent = `$${laborTotal.toFixed(2)}`;
  if (priceParts) priceParts.textContent = `$${partsTotal.toFixed(2)}`;
  if (priceEnv) priceEnv.textContent = `$${environmental.toFixed(2)}`;

  if (AppState.discountAmount > 0) {
    if (discountRow) discountRow.style.display = 'flex';
    if (priceDisc) priceDisc.textContent = `-$${AppState.discountAmount.toFixed(2)}`;
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }

  if (finalTotal) finalTotal.textContent = `$${final.toFixed(2)}`;
}

function updateSummaryDisplay() {
  const sumVehicle = document.getElementById('sumVehicle');
  const sumLocationMode = document.getElementById('sumLocationMode');
  const sumMechanic = document.getElementById('sumMechanic');
  const sumDateTime = document.getElementById('sumDateTime');
  const sumAddress = document.getElementById('sumAddress');
  const sumServicesList = document.getElementById('sumServicesList');

  const mech = MECHANICS_DATA.find(m => m.id === AppState.selectedMechanicId) || MECHANICS_DATA[0];

  if (sumVehicle) {
    sumVehicle.textContent = `${AppState.vehicle.year} ${AppState.vehicle.make} ${AppState.vehicle.model} (${AppState.vehicle.fuel})`;
  }
  if (sumLocationMode) {
    sumLocationMode.textContent = AppState.vehicle.locationType === 'mobile'
      ? 'Mobile Doorstep Service (Technician arrives at your address)'
      : 'Partner Workshop Bay Drop-Off (Drop off at bay)';
  }
  if (sumMechanic) {
    sumMechanic.textContent = `${mech.name} (${mech.role})`;
  }
  if (sumDateTime) {
    sumDateTime.textContent = `${AppState.selectedDate || 'Tomorrow'} • ${AppState.selectedSlot || '08:30 AM'}`;
  }
  if (sumAddress) {
    sumAddress.textContent = AppState.customer.address || '742 Evergreen Terrace, San Francisco';
  }

  if (sumServicesList) {
    sumServicesList.innerHTML = AppState.selectedServices.map(sId => {
      const s = SERVICES_DATA.find(item => item.id === sId);
      if (!s) return '';
      return `<li><span><i class="fa-solid fa-check text-success"></i> ${s.title}</span> <strong>$${s.price}</strong></li>`;
    }).join('');
  }
}

// --- COUPON SYSTEM ---
function initCouponEngine() {
  const applyBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponInput');
  const messageEl = document.getElementById('couponMessage');
  const codeTag = document.getElementById('discountCodeName');

  if (applyBtn && couponInput) {
    applyBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'SMART20') {
        AppState.discountAmount = 20;
        AppState.couponCode = 'SMART20';
        if (codeTag) codeTag.textContent = 'SMART20';
        if (messageEl) {
          messageEl.textContent = '✓ Coupon SMART20 applied! Saved $20.00';
          messageEl.style.color = 'var(--accent-emerald)';
        }
        showToast('Promo code SMART20 applied: $20 off!', 'success');
      } else if (code === 'SAVE15') {
        AppState.discountAmount = 15;
        AppState.couponCode = 'SAVE15';
        if (codeTag) codeTag.textContent = 'SAVE15';
        if (messageEl) {
          messageEl.textContent = '✓ Coupon SAVE15 applied! Saved $15.00';
          messageEl.style.color = 'var(--accent-emerald)';
        }
        showToast('Promo code SAVE15 applied: $15 off!', 'success');
      } else {
        if (messageEl) {
          messageEl.textContent = 'Invalid promo code. Try SMART20.';
          messageEl.style.color = 'var(--accent-red)';
        }
        showToast('Invalid promo code. Use SMART20.', 'warning');
      }
      updatePricingCalculation();
    });
  }
}

// --- BOOKING CONFIRMATION & STORAGE ---
function processBookingConfirmation() {
  const bookingId = `#SM-${Math.floor(10000 + Math.random() * 90000)}`;
  const mech = MECHANICS_DATA.find(m => m.id === AppState.selectedMechanicId) || MECHANICS_DATA[0];

  const newBooking = {
    id: bookingId,
    timestamp: new Date().toISOString(),
    vehicle: `${AppState.vehicle.year} ${AppState.vehicle.make} ${AppState.vehicle.model}`,
    services: AppState.selectedServices.map(id => SERVICES_DATA.find(s => s.id === id)?.title || id),
    mechanicName: mech.name,
    scheduledTime: `${AppState.selectedDate || 'Tomorrow'} • ${AppState.selectedSlot || '08:30 AM'}`,
    address: AppState.customer.address,
    status: 'Confirmed & En Route'
  };

  AppState.activeBookings.unshift(newBooking);
  saveBookingsToStorage();
  updateBookingsBadge();

  // Populate success pane
  const successBookingId = document.getElementById('successBookingId');
  const successMechanicName = document.getElementById('successMechanicName');
  const successScheduledTime = document.getElementById('successScheduledTime');

  if (successBookingId) successBookingId.textContent = bookingId;
  if (successMechanicName) successMechanicName.textContent = mech.name;
  if (successScheduledTime) successScheduledTime.textContent = newBooking.scheduledTime;

  // Sync Live Tracker
  const trackerOrderId = document.getElementById('trackerOrderId');
  if (trackerOrderId) trackerOrderId.textContent = bookingId;

  // Hide wizard panes, show success
  document.querySelectorAll('.wizard-step-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('wizardStepSuccess')?.classList.add('active');

  showToast(`Booking ${bookingId} confirmed! Technician reserved.`, 'success');
}

function saveBookingsToStorage() {
  try {
    localStorage.setItem('smartmech_bookings', JSON.stringify(AppState.activeBookings));
  } catch (e) {
    console.error('Storage error', e);
  }
}

function loadBookingsFromStorage() {
  try {
    const saved = localStorage.getItem('smartmech_bookings');
    if (saved) {
      AppState.activeBookings = JSON.parse(saved);
    } else {
      // Seed default demo booking
      AppState.activeBookings = [
        {
          id: '#SM-84920',
          timestamp: new Date().toISOString(),
          vehicle: '2022 Honda Civic',
          services: ['Full Synthetic Oil & Filter Service', 'Multi-Point Inspection'],
          mechanicName: 'Sarah Mitchell',
          scheduledTime: 'Tomorrow • 08:30 AM',
          address: '742 Evergreen Terrace, San Francisco',
          status: 'Mechanic Dispatched'
        }
      ];
    }
  } catch (e) {
    console.error('Storage parse error', e);
  }
}

function updateBookingsBadge() {
  const badge = document.getElementById('bookingsCountBadge');
  if (badge) {
    badge.textContent = AppState.activeBookings.length;
  }
}

// --- AI SYMPTOM DIAGNOSTICS TOOL ---
function initDiagnosticsTool() {
  const chips = document.querySelectorAll('#symptomTagsGrid .symptom-chip');
  const clearBtn = document.getElementById('clearSymptomsBtn');
  const bookFixBtn = document.getElementById('bookDiagnosedIssueBtn');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      const symptomId = chip.dataset.id;
      const diagData = SYMPTOM_DATABASE[symptomId];
      if (diagData) {
        renderDiagnosisResult(diagData);
      }
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      // Reset to brake squeak
      const defaultChip = document.querySelector('[data-id="brake_squeak"]');
      defaultChip?.classList.add('selected');
      renderDiagnosisResult(SYMPTOM_DATABASE.brake_squeak);
      showToast('Reset diagnostics to default symptom', 'info');
    });
  }

  if (bookFixBtn) {
    bookFixBtn.addEventListener('click', () => {
      const selectedChip = document.querySelector('#symptomTagsGrid .symptom-chip.selected');
      const symptomId = selectedChip?.dataset.id || 'brake_squeak';
      const diagData = SYMPTOM_DATABASE[symptomId];

      if (diagData && diagData.serviceId) {
        if (!AppState.selectedServices.includes(diagData.serviceId)) {
          AppState.selectedServices.push(diagData.serviceId);
        }
        renderServicesGrid();
        goToStep(2);
        document.getElementById('bookingSection').scrollIntoView({ behavior: 'smooth' });
        showToast(`Added ${diagData.fix} to your appointment!`, 'success');
      }
    });
  }
}

function renderDiagnosisResult(data) {
  const title = document.getElementById('diagProblemTitle');
  const desc = document.getElementById('diagProblemDesc');
  const root = document.getElementById('diagRootCause');
  const fix = document.getElementById('diagRecommendedFix');
  const cost = document.getElementById('diagCostRange');
  const time = document.getElementById('diagEstimatedTime');
  const severityBadge = document.getElementById('diagSeverityBadge');
  const severityText = document.getElementById('diagSeverityText');

  if (title) title.textContent = `Probable Cause: ${data.title}`;
  if (desc) desc.textContent = data.cause;
  if (root) root.textContent = data.category;
  if (fix) fix.textContent = data.fix;
  if (cost) cost.textContent = data.cost;
  if (time) time.textContent = data.time;

  if (severityText) severityText.textContent = `${data.severity} Severity — Action Recommended`;
  if (severityBadge) {
    if (data.severity === 'Critical') {
      severityBadge.style.color = 'var(--accent-red)';
    } else {
      severityBadge.style.color = 'var(--accent-amber)';
    }
  }
}

// --- LIVE SERVICE TRACKER SIMULATOR ---
function initTrackerSimulation() {
  const advanceBtn = document.getElementById('simulateTrackerAdvanceBtn');
  const callBtn = document.getElementById('callTechBtn');

  const phases = [
    { step: 1, chip: 'Appointment Confirmed', eta: '35 Mins', msg: 'System scheduled technician.' },
    { step: 2, chip: 'Mechanic Dispatched', eta: '18 Mins', msg: 'Sarah Mitchell departed base station in Mobile Van #04.' },
    { step: 3, chip: 'On-Site Diagnostic', eta: 'Arrived', msg: 'Sarah arrived at your address. Conducting OBD-II scan.' },
    { step: 4, chip: 'Repair in Progress', eta: '30 Mins Rem.', msg: 'Installed OEM filter and Mobil-1 synthetic oil.' },
    { step: 5, chip: 'Complete & Tested', eta: 'Done ✓', msg: 'Multi-point safety test passed. Digital warranty generated.' }
  ];

  let currentPhaseIndex = 1; // start at step 2

  if (advanceBtn) {
    advanceBtn.addEventListener('click', () => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const phase = phases[currentPhaseIndex];

      // Update timeline nodes
      document.querySelectorAll('#trackerTimeline .timeline-step').forEach(stepEl => {
        const stepNum = parseInt(stepEl.dataset.step, 10);
        stepEl.classList.remove('active', 'completed');
        if (stepNum < phase.step) {
          stepEl.classList.add('completed');
        } else if (stepNum === phase.step) {
          stepEl.classList.add('active');
        }
      });

      // Update lines
      document.querySelectorAll('#trackerTimeline .timeline-line').forEach((line, index) => {
        if (index + 1 < phase.step) {
          line.classList.add('completed');
        } else {
          line.classList.remove('completed');
        }
      });

      // Update chips & eta
      const chip = document.getElementById('trackerStatusChip');
      const eta = document.getElementById('trackerEtaTimer');
      if (chip) chip.textContent = phase.chip;
      if (eta) eta.textContent = phase.eta;

      // Add log entry
      const logList = document.getElementById('trackerLogList');
      if (logList) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newEntry = document.createElement('div');
        newEntry.className = 'log-entry highlight';
        newEntry.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-msg"><i class="fa-solid fa-arrow-right text-cyan"></i> ${phase.msg}</span>`;
        logList.appendChild(newEntry);
      }

      showToast(`Tracker updated: ${phase.chip}`, 'info');
    });
  }

  if (callBtn) {
    callBtn.addEventListener('click', () => {
      showToast('Connecting simulated encrypted voice line to Sarah Mitchell...', 'info');
      setTimeout(() => {
        alert('📞 Technician Line: Sarah is driving and will answer via hands-free headset.');
      }, 500);
    });
  }
}

// --- EMERGENCY 24/7 SOS MODAL ---
function initSosModal() {
  const sosModalBackdrop = document.getElementById('sosModalBackdrop');
  const sosHeaderBtn = document.getElementById('sosHeaderBtn');
  const floatingSosBtn = document.getElementById('floatingSosBtn');
  const drawerSosBtn = document.getElementById('drawerSosBtn');
  const closeSosBtn = document.getElementById('closeSosModal');
  const dispatchNowBtn = document.getElementById('dispatchSosNowBtn');
  const refreshGpsBtn = document.getElementById('refreshGpsBtn');
  const successBox = document.getElementById('sosDispatchSuccess');

  const openSos = () => {
    sosModalBackdrop?.classList.add('active');
  };

  const closeSos = () => {
    sosModalBackdrop?.classList.remove('active');
    if (successBox) successBox.style.display = 'none';
  };

  sosHeaderBtn?.addEventListener('click', openSos);
  floatingSosBtn?.addEventListener('click', openSos);
  drawerSosBtn?.addEventListener('click', openSos);
  closeSosBtn?.addEventListener('click', closeSos);

  sosModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === sosModalBackdrop) closeSos();
  });

  // SOS service selection cards
  const sosCards = document.querySelectorAll('#sosServicesGrid .sos-type-card');
  sosCards.forEach(card => {
    card.addEventListener('click', () => {
      sosCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  if (refreshGpsBtn) {
    refreshGpsBtn.addEventListener('click', () => {
      const locInput = document.getElementById('sosLocation');
      if (locInput) {
        locInput.value = 'GPS High-Accuracy: 37.7833° N, 122.4167° W (Near 5th & Mission)';
      }
      showToast('GPS coordinates calibrated via satellite', 'success');
    });
  }

  if (dispatchNowBtn) {
    dispatchNowBtn.addEventListener('click', () => {
      if (successBox) {
        successBox.style.display = 'flex';
      }
      showToast('EMERGENCY SOS: Mobile Recovery Unit Dispatched!', 'warning');
    });
  }

  // "My Bookings" Drawer Modal
  const viewAppointmentsBtn = document.getElementById('viewAppointmentsBtn');
  const bookingsModalBackdrop = document.getElementById('bookingsModalBackdrop');
  const closeBookingsModal = document.getElementById('closeBookingsModal');

  if (viewAppointmentsBtn && bookingsModalBackdrop) {
    viewAppointmentsBtn.addEventListener('click', () => {
      renderMyBookingsList();
      bookingsModalBackdrop.classList.add('active');
    });

    closeBookingsModal?.addEventListener('click', () => {
      bookingsModalBackdrop.classList.remove('active');
    });

    bookingsModalBackdrop.addEventListener('click', (e) => {
      if (e.target === bookingsModalBackdrop) {
        bookingsModalBackdrop.classList.remove('active');
      }
    });
  }

  // Mechanic Partner Modal
  const openPartnerBtn = document.getElementById('openPartnerModalBtn');
  const partnerModalBackdrop = document.getElementById('partnerModalBackdrop');
  const closePartnerBtn = document.getElementById('closePartnerModal');
  const partnerForm = document.getElementById('partnerApplicationForm');

  if (openPartnerBtn && partnerModalBackdrop) {
    openPartnerBtn.addEventListener('click', () => {
      partnerModalBackdrop.classList.add('active');
    });

    closePartnerBtn?.addEventListener('click', () => {
      partnerModalBackdrop.classList.remove('active');
    });

    partnerModalBackdrop.addEventListener('click', (e) => {
      if (e.target === partnerModalBackdrop) partnerModalBackdrop.classList.remove('active');
    });

    partnerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      partnerModalBackdrop.classList.remove('active');
      showToast('Application submitted! Our technician onboarding team will call you within 24 hours.', 'success');
    });
  }
}

function renderMyBookingsList() {
  const container = document.getElementById('bookingsListContainer');
  if (!container) return;

  if (AppState.activeBookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; margin-bottom: 0.75rem;"></i>
        <p>No appointments booked yet. Schedule your first appointment today!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.activeBookings.map(b => `
    <div class="booking-item-card">
      <div class="bic-top">
        <span class="bic-id">${b.id}</span>
        <span class="badge-pill">${b.status}</span>
      </div>
      <div class="bic-body">
        <div><strong>Vehicle:</strong> ${b.vehicle}</div>
        <div><strong>Assigned Tech:</strong> ${b.mechanicName}</div>
        <div><strong>Time:</strong> ${b.scheduledTime}</div>
        <div><strong>Services:</strong> ${b.services.join(', ')}</div>
      </div>
      <div class="bic-actions">
        <button class="btn btn-sm btn-outline track-bic-btn" data-id="${b.id}">
          <i class="fa-solid fa-satellite-dish"></i> Open Tracker
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.track-bic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('bookingsModalBackdrop')?.classList.remove('active');
      document.getElementById('trackerSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// --- PARTNER INCOME CALCULATOR ---
function initPartnerCalculator() {
  const slider = document.getElementById('hoursSlider');
  const hoursVal = document.getElementById('hoursVal');
  const display = document.getElementById('calcEarningsDisplay');

  if (slider && hoursVal && display) {
    slider.addEventListener('input', () => {
      const jobs = parseInt(slider.value, 10);
      hoursVal.textContent = `${jobs} jobs`;
      const earnings = jobs * 98; // Avg $98 net per job
      display.textContent = `$${earnings.toLocaleString()} / week`;
    });
  }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle text-primary';
  if (type === 'success') icon = 'fa-circle-check text-success';
  if (type === 'warning') icon = 'fa-triangle-exclamation text-warning';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
