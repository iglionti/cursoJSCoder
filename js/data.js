const TAX_RATE = 0.21;
const GROUP_DISCOUNT_THRESHOLD = 3;
const GROUP_DISCOUNT_RATE = 0.1;

const EXCHANGE_RATES = {
  USD: 1000,
  EUR: 1100,
  ARS: 1
};

let DESTINATIONS = [];
let ACTIVITIES = {};

async function loadDestinations() {
  try {
    const response = await fetch('data/destinations.json');
    if (!response.ok) {
      throw new Error('Error al cargar destinos');
    }
    DESTINATIONS = await response.json();
    return DESTINATIONS;
  } catch (error) {
    console.error('Error loading destinations:', error);
    showError('No se pudieron cargar los destinos. Por favor, recarga la página.');
    return [];
  }
}

async function loadActivities() {
  try {
    const response = await fetch('data/activities.json');
    if (!response.ok) {
      throw new Error('Error al cargar actividades');
    }
    ACTIVITIES = await response.json();
    return ACTIVITIES;
  } catch (error) {
    console.error('Error loading activities:', error);
    showError('No se pudieron cargar las actividades. Por favor, recarga la página.');
    return {};
  }
}

async function initializeData() {
  showLoading(true);
  try {
    await Promise.all([
      loadDestinations(),
      loadActivities()
    ]);
    showLoading(false);
    return true;
  } catch (error) {
    showLoading(false);
    showError('Error al inicializar la aplicación. Por favor, recarga la página.');
    return false;
  }
}

function getDestinations() {
  return DESTINATIONS;
}

function getActivitiesByDestination(destinationName) {
  return ACTIVITIES[destinationName] || [];
}

function getDestinationById(id) {
  return DESTINATIONS.find(d => d.id === id);
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
