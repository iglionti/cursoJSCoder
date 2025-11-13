function showSection(sectionId) {
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function showLoading(show) {
  const loadingEl = document.getElementById('loadingOverlay');
  if (loadingEl) {
    loadingEl.style.display = show ? 'flex' : 'none';
  }
}

function showError(message) {
  Toastify({
    text: message,
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "#dc3545",
    stopOnFocus: true
  }).showToast();
}

function showSuccess(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#198754",
    stopOnFocus: true
  }).showToast();
}

function populateDestinations() {
  const select = document.getElementById('destination');
  select.innerHTML = '<option value="">Selecciona un destino</option>';
  
  const destinations = getDestinations();
  destinations.forEach(dest => {
    const option = document.createElement('option');
    option.value = dest.id;
    option.textContent = `${dest.name} - ${formatMoney(dest.hotelPerNight, dest.currency)}/noche`;
    select.appendChild(option);
  });
}

function updateActivitiesOptions(destinationName) {
  const container = document.getElementById('activitiesContainer');
  const activities = getActivitiesByDestination(destinationName);
  
  if (activities.length === 0) {
    container.innerHTML = '<p class="text-muted mb-0">No hay actividades disponibles para este destino</p>';
    return;
  }
  
  const destination = getDestinations().find(d => d.name === destinationName);
  container.innerHTML = '';
  
  activities.forEach(activity => {
    const div = document.createElement('div');
    div.className = 'form-check mb-2';
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${activity.code}" id="activity-${activity.code}">
      <label class="form-check-label" for="activity-${activity.code}">
        <strong>${activity.name}</strong> - ${formatMoney(activity.price, destination.currency)}
        <br><small class="text-muted">${activity.description}</small>
      </label>
    `;
    container.appendChild(div);
  });
}

function getSelectedActivities(destinationName) {
  const activities = getActivitiesByDestination(destinationName);
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

function renderTravelersList(bookings) {
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
          <button class="btn btn-sm btn-danger btn-icon" onclick="removeTraveler(${index})" title="Eliminar viajero">
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

function renderSummary(bookings) {
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
