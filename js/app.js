let bookings = [];
let totalTravelers = 0;
let currentTravelerIndex = 0;

async function initializeApp() {
  const success = await initializeData();
  
  if (success) {
    const savedBookings = loadCurrentBookings();
    if (savedBookings && savedBookings.length > 0) {
      bookings = savedBookings;
    }
    
    populateDestinations();
    setupEventListeners();
    showSuccess('Aplicación cargada correctamente');
  }
}

function setupEventListeners() {
  document.getElementById('startForm').addEventListener('submit', handleStartForm);
  document.getElementById('destination').addEventListener('change', handleDestinationChange);
  document.getElementById('travelerAge').addEventListener('input', handleAgeInput);
  document.getElementById('travelerForm').addEventListener('submit', handleTravelerForm);
  document.getElementById('backBtn').addEventListener('click', handleBackButton);
  document.getElementById('addMoreBtn').addEventListener('click', handleAddMoreButton);
  document.getElementById('confirmBtn').addEventListener('click', handleConfirmButton);
  document.getElementById('newBookingBtn').addEventListener('click', handleNewBookingButton);
}

function handleStartForm(e) {
  e.preventDefault();
  totalTravelers = parseInt(document.getElementById('numTravelers').value);
  currentTravelerIndex = 0;
  bookings = [];
  document.getElementById('currentTravelerNum').textContent = `(1 de ${totalTravelers})`;
  showSection('travelerSection');
}

function handleDestinationChange() {
  const destId = parseInt(this.value);
  if (destId) {
    const destination = getDestinationById(destId);
    updateActivitiesOptions(destination.name);
  } else {
    document.getElementById('activitiesContainer').innerHTML = '<p class="text-muted mb-0">Selecciona un destino para ver actividades disponibles</p>';
  }
}

function handleAgeInput() {
  const age = parseInt(this.value);
  const warning = document.getElementById('minorWarning');
  if (age < 18 && age > 0) {
    warning.classList.remove('d-none');
  } else {
    warning.classList.add('d-none');
  }
}

function handleTravelerForm(e) {
  e.preventDefault();
  
  try {
    const name = document.getElementById('travelerName').value;
    const age = parseInt(document.getElementById('travelerAge').value);
    const destId = parseInt(document.getElementById('destination').value);
    const nights = parseInt(document.getElementById('nights').value);
    
    const destination = getDestinationById(destId);
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
    saveCurrentBookings(bookings);
    
    currentTravelerIndex++;
    
    if (currentTravelerIndex < totalTravelers) {
      document.getElementById('currentTravelerNum').textContent = `(${currentTravelerIndex + 1} de ${totalTravelers})`;
      resetTravelerForm();
      showSuccess(`Viajero ${name} agregado correctamente`);
    } else {
      renderTravelersList(bookings);
      renderSummary(bookings);
      showSection('summarySection');
      showSuccess('Todos los viajeros agregados');
    }
  } catch (error) {
    showError('Error al procesar el viajero. Por favor, intenta nuevamente.');
  }
}

function handleBackButton() {
  showSection('startSection');
}

function handleAddMoreButton() {
  totalTravelers++;
  currentTravelerIndex = bookings.length;
  document.getElementById('currentTravelerNum').textContent = `(${currentTravelerIndex + 1} de ${totalTravelers})`;
  resetTravelerForm();
  showSection('travelerSection');
}

function handleConfirmButton() {
  Swal.fire({
    title: '¿Confirmar reserva?',
    text: 'Se guardará tu reserva y se limpiará el carrito actual',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const group = summarizeGroup(bookings);
      const historyEntry = {
        bookings: bookings,
        summary: group,
        totalTravelers: bookings.length
      };
      
      saveBookingHistory(historyEntry);
      clearCurrentBookings();
      
      showSection('confirmationSection');
      showSuccess('Reserva confirmada exitosamente');
    }
  });
}

function handleNewBookingButton() {
  bookings = [];
  clearCurrentBookings();
  document.getElementById('numTravelers').value = 1;
  showSection('startSection');
}

function removeTraveler(index) {
  Swal.fire({
    title: '¿Eliminar viajero?',
    text: `Se eliminará a ${bookings[index].name} de la reserva`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const removedName = bookings[index].name;
      bookings.splice(index, 1);
      saveCurrentBookings(bookings);
      renderTravelersList(bookings);
      renderSummary(bookings);
      
      if (bookings.length === 0) {
        showSection('startSection');
      }
      
      showSuccess(`${removedName} eliminado de la reserva`);
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
