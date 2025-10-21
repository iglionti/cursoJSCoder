const TAX_RATE = 0.21;
const GROUP_DISCOUNT_THRESHOLD = 3;
const GROUP_DISCOUNT_RATE = 0.1;

const EXCHANGE_RATES = {
  USD: 1000,
  EUR: 1100,
  ARS: 1
};

const DESTINATIONS = [
  { id: 1, name: "Buenos Aires", currency: "ARS", hotelPerNight: 60000 },
  { id: 2, name: "Miami", currency: "USD", hotelPerNight: 120 },
  { id: 3, name: "Madrid", currency: "EUR", hotelPerNight: 100 }
];

const ACTIVITIES = {
  "Buenos Aires": [
    { code: "TBA", name: "City tour histórico", price: 20000 },
    { code: "MTE", name: "Cena show de tango", price: 45000 },
    { code: "DEL", name: "Delta Tigre full day", price: 38000 }
  ],
  "Miami": [
    { code: "BIS", name: "Biscayne boat tour", price: 60 },
    { code: "MAL", name: "Tour Miami + Wynwood", price: 55 },
    { code: "KEY", name: "Excursión a Key West", price: 90 }
  ],
  "Madrid": [
    { code: "MCT", name: "City tour + Palacio Real", price: 65 },
    { code: "TOLE", name: "Excursión a Toledo", price: 70 },
    { code: "SEG", name: "Excursión a Segovia", price: 80 }
  ]
};

let bookings = [];
let totalTravelers = 0;
let currentTravelerIndex = 0;

function saveToLocalStorage() {
  const data = {
    bookings: bookings,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('travelBookings', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('travelBookings');
  if (data) {
    const parsed = JSON.parse(data);
    bookings = parsed.bookings || [];
  }
}

function clearLocalStorage() {
  localStorage.removeItem('travelBookings');
}

function formatMoney(value, currency) {
  return `${value.toFixed(2)} ${currency}`;
}

function calculateTripCost({ destination, nights, activities }) {
  const hotel = destination.hotelPerNight * nights;
  const activitiesTotal = activities.reduce((acc, a) => acc + a.price, 0);
  const subtotal = hotel + activitiesTotal;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;
  return { hotel, activitiesTotal, subtotal, taxes, total, currency: destination.currency };
}

function convertToARS(amount, currency) {
  const rate = EXCHANGE_RATES[currency] || 1;
  return amount * rate;
}

function summarizeGroup(bookings) {
  const totalInCurrencyByDest = {};
  const totalInARS = bookings.reduce((acc, b) => {
    const tARS = convertToARS(b.total, b.currency);
    totalInCurrencyByDest[b.currency] = (totalInCurrencyByDest[b.currency] || 0) + b.total;
    return acc + tARS;
  }, 0);

  let discountARS = 0;
  if (bookings.length > GROUP_DISCOUNT_THRESHOLD) {
    discountARS = totalInARS * GROUP_DISCOUNT_RATE;
  }
  const finalARS = totalInARS - discountARS;

  return { totalInCurrencyByDest, totalInARS, discountARS, finalARS };
}

function showSection(sectionId) {
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function populateDestinations() {
  const select = document.getElementById('destination');
  select.innerHTML = '<option value="">Selecciona un destino</option>';
  
  DESTINATIONS.forEach(dest => {
    const option = document.createElement('option');
    option.value = dest.id;
    option.textContent = `${dest.name} - ${formatMoney(dest.hotelPerNight, dest.currency)}/noche`;
    select.appendChild(option);
  });
}

function updateActivitiesOptions(destinationName) {
  const container = document.getElementById('activitiesContainer');
  const activities = ACTIVITIES[destinationName] || [];
  
  if (activities.length === 0) {
    container.innerHTML = '<p class="text-muted mb-0">No hay actividades disponibles para este destino</p>';
    return;
  }
  
  container.innerHTML = '';
  activities.forEach(activity => {
    const div = document.createElement('div');
    div.className = 'form-check mb-2';
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${activity.code}" id="activity-${activity.code}">
      <label class="form-check-label" for="activity-${activity.code}">
        ${activity.name} - ${formatMoney(activity.price, DESTINATIONS.find(d => d.name === destinationName).currency)}
      </label>
    `;
    container.appendChild(div);
  });
}

function getSelectedActivities(destinationName) {
  const activities = ACTIVITIES[destinationName] || [];
  const selected = [];
  
  activities.forEach(activity => {
    const checkbox = document.getElementById(`activity-${activity.code}`);
    if (checkbox && checkbox.checked) {
      selected.push(activity);
    }
  });
  
  return selected;
}

function resetTravelerForm() {
  document.getElementById('travelerForm').reset();
  document.getElementById('activitiesContainer').innerHTML = '<p class="text-muted mb-0">Selecciona un destino para ver actividades disponibles</p>';
  document.getElementById('minorWarning').classList.add('d-none');
}

function renderTravelersList() {
  const container = document.getElementById('travelersListContainer');
  
  if (bookings.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i><p>No hay viajeros agregados</p></div>';
    return;
  }
  
  container.innerHTML = '';
  bookings.forEach((booking, index) => {
    const card = document.createElement('div');
    card.className = 'traveler-card';
    
    const activitiesList = booking.activities.length > 0
      ? `<ul class="activities-list">${booking.activities.map(a => `<li>${a.name}</li>`).join('')}</ul>`
      : '<p class="text-muted mb-0">Sin actividades</p>';
    
    card.innerHTML = `
      <div class="traveler-header">
        <h5 class="traveler-name">${booking.name}</h5>
        <div class="traveler-actions">
          <button class="btn btn-sm btn-danger btn-icon" onclick="removeTraveler(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="traveler-details">
        <div class="detail-item">
          <span class="detail-label">Edad</span>
          <span class="detail-value">${booking.age} años</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Destino</span>
          <span class="detail-value">${booking.destination}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Noches</span>
          <span class="detail-value">${booking.nights}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Total</span>
          <span class="detail-value">${formatMoney(booking.total, booking.currency)}</span>
        </div>
      </div>
      ${booking.activities.length > 0 ? `<div class="mt-3"><strong>Actividades:</strong>${activitiesList}</div>` : ''}
    `;
    
    container.appendChild(card);
  });
}

function renderSummary() {
  const group = summarizeGroup(bookings);
  const summaryGrid = document.getElementById('summaryGrid');
  
  summaryGrid.innerHTML = '';
  
  Object.entries(group.totalInCurrencyByDest).forEach(([currency, amount]) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <div class="summary-card-title">Total en ${currency}</div>
      <div class="summary-card-value">${formatMoney(amount, currency)}</div>
    `;
    summaryGrid.appendChild(card);
  });
  
  const totalCard = document.createElement('div');
  totalCard.className = 'summary-card';
  totalCard.innerHTML = `
    <div class="summary-card-title">Total en ARS</div>
    <div class="summary-card-value">${formatMoney(group.totalInARS, 'ARS')}</div>
  `;
  summaryGrid.appendChild(totalCard);
  
  if (group.discountARS > 0) {
    const discountCard = document.createElement('div');
    discountCard.className = 'summary-card discount';
    discountCard.innerHTML = `
      <div class="summary-card-title">Descuento Grupo (${(GROUP_DISCOUNT_RATE * 100).toFixed(0)}%)</div>
      <div class="summary-card-value">-${formatMoney(group.discountARS, 'ARS')}</div>
    `;
    summaryGrid.appendChild(discountCard);
  }
  
  document.getElementById('totalFinal').textContent = formatMoney(group.finalARS, 'ARS');
}

function removeTraveler(index) {
  bookings.splice(index, 1);
  saveToLocalStorage();
  renderTravelersList();
  renderSummary();
  
  if (bookings.length === 0) {
    showSection('startSection');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadFromLocalStorage();
  populateDestinations();
  
  document.getElementById('startForm').addEventListener('submit', function(e) {
    e.preventDefault();
    totalTravelers = parseInt(document.getElementById('numTravelers').value);
    currentTravelerIndex = 0;
    bookings = [];
    document.getElementById('currentTravelerNum').textContent = `(1 de ${totalTravelers})`;
    showSection('travelerSection');
  });
  
  document.getElementById('destination').addEventListener('change', function() {
    const destId = parseInt(this.value);
    if (destId) {
      const destination = DESTINATIONS.find(d => d.id === destId);
      updateActivitiesOptions(destination.name);
    } else {
      document.getElementById('activitiesContainer').innerHTML = '<p class="text-muted mb-0">Selecciona un destino para ver actividades disponibles</p>';
    }
  });
  
  document.getElementById('travelerAge').addEventListener('input', function() {
    const age = parseInt(this.value);
    const warning = document.getElementById('minorWarning');
    if (age < 18 && age > 0) {
      warning.classList.remove('d-none');
    } else {
      warning.classList.add('d-none');
    }
  });
  
  document.getElementById('travelerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('travelerName').value;
    const age = parseInt(document.getElementById('travelerAge').value);
    const destId = parseInt(document.getElementById('destination').value);
    const nights = parseInt(document.getElementById('nights').value);
    
    const destination = DESTINATIONS.find(d => d.id === destId);
    const activities = getSelectedActivities(destination.name);
    
    const costs = calculateTripCost({ destination, nights, activities });
    
    const booking = {
      name,
      age,
      destination: destination.name,
      currency: destination.currency,
      nights,
      activities,
      ...costs
    };
    
    bookings.push(booking);
    saveToLocalStorage();
    
    currentTravelerIndex++;
    
    if (currentTravelerIndex < totalTravelers) {
      document.getElementById('currentTravelerNum').textContent = `(${currentTravelerIndex + 1} de ${totalTravelers})`;
      resetTravelerForm();
    } else {
      renderTravelersList();
      renderSummary();
      showSection('summarySection');
    }
  });
  
  document.getElementById('backBtn').addEventListener('click', function() {
    showSection('startSection');
  });
  
  document.getElementById('addMoreBtn').addEventListener('click', function() {
    totalTravelers++;
    currentTravelerIndex = bookings.length;
    document.getElementById('currentTravelerNum').textContent = `(${currentTravelerIndex + 1} de ${totalTravelers})`;
    resetTravelerForm();
    showSection('travelerSection');
  });
  
  document.getElementById('confirmBtn').addEventListener('click', function() {
    showSection('confirmationSection');
  });
  
  document.getElementById('newBookingBtn').addEventListener('click', function() {
    bookings = [];
    clearLocalStorage();
    document.getElementById('numTravelers').value = 1;
    showSection('startSection');
  });
});
