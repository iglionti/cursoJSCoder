// 1) Constantes, variables y arrays
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
  { id: 2, name: "Miami",        currency: "USD", hotelPerNight: 120 },
  { id: 3, name: "Madrid",       currency: "EUR", hotelPerNight: 100 }
];

const ACTIVITIES = {
  "Buenos Aires": [
    { code: "TBA", name: "City tour histórico", price: 20000 },
    { code: "MTE", name: "Cena show de tango",  price: 45000 },
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

function promptNumber(message, { min = 0, max = Infinity } = {}) {
  while (true) {
    const raw = prompt(message);
    if (raw === null) return null; 
    const n = Number(raw);
    if (!Number.isNaN(n) && n >= min && n <= max && Number.isFinite(n)) {
      return n;
    }
    alert(`Valor inválido. Debe ser un número entre ${min} y ${max}.`);
  }
}

function chooseDestination() {
  const options = DESTINATIONS.map(d => `${d.id}) ${d.name} (${d.currency}) – Hotel/noche: ${d.hotelPerNight} ${d.currency}`).join("\n");
  const id = promptNumber(
    "Elige un destino (ingresa el número):\n" + options,
    { min: 1, max: DESTINATIONS.length }
  );
  if (id === null) return null;
  return DESTINATIONS.find(d => d.id === id);
}

function chooseActivities(destinationName) {
  const list = ACTIVITIES[destinationName] || [];
  if (list.length === 0) return [];

  alert(
    "A continuación podrás agregar actividades opcionales.\n" +
    "Se te mostrará la lista y podrás ingresar códigos separados por coma."
  );

  const menu = list.map(a => `- ${a.code}: ${a.name} (${a.price})`).join("\n");
  const raw = prompt(
    `Actividades disponibles en ${destinationName}:\n${menu}\n\n` +
    "Ingresa códigos separados por coma (o deja vacío para ninguna):"
  );

  if (raw === null || raw.trim() === "") return [];

  const codes = raw.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  const selected = list.filter(a => codes.includes(a.code));

  const invalid = codes.filter(c => !list.some(a => a.code === c));
  if (invalid.length) {
    alert("Códigos inválidos ignorados: " + invalid.join(", "));
  }
  return selected;
}

function formatMoney(value, currency) {
  return `${value.toFixed(2)} ${currency}`;
}

// Lógica principal de cálculo
function calculateTripCost({ destination, nights, activities }) {
  const hotel = destination.hotelPerNight * nights;
  const activitiesTotal = activities.reduce((acc, a) => acc + a.price, 0);
  const subtotal = hotel + activitiesTotal;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;
  return { hotel, activitiesTotal, subtotal, taxes, total, currency: destination.currency };
}

function convertToARS(amount, currency) {
  const rate = EXCHANGE_RATES[currency] ?? 1;
  return amount * rate;
}


// Flujo por viajero
function collectTravelerBooking(travelerIndex) {
  alert(`Cargando reserva para Viajero #${travelerIndex + 1}`);

  const name = prompt("Nombre del viajero:");
  if (name === null) return null;

  const age = promptNumber("Edad del viajero:", { min: 0, max: 120 });
  if (age === null) return null;

  if (age < 18) {
    const okMinor = confirm("El viajero es menor de edad. ¿Continúas bajo responsabilidad de un adulto?");
    if (!okMinor) return null;
  }

  const destination = chooseDestination();
  if (!destination) return null;

  const nights = promptNumber("¿Cuántas noches se hospedarán?", { min: 1, max: 60 });
  if (nights === null) return null;

  const activities = chooseActivities(destination.name);

  const { hotel, activitiesTotal, subtotal, taxes, total, currency } = calculateTripCost({
    destination, nights, activities
  });

  // Confirmar la reserva de este viajero
  const summaryMsg =
    `Resumen para ${name}:\n` +
    `Destino: ${destination.name}\n` +
    `Noches: ${nights}\n` +
    `Hotel: ${formatMoney(hotel, currency)}\n` +
    `Actividades: ${formatMoney(activitiesTotal, currency)}\n` +
    `Subtotal: ${formatMoney(subtotal, currency)}\n` +
    `Impuestos (${(TAX_RATE*100).toFixed(0)}%): ${formatMoney(taxes, currency)}\n` +
    `Total: ${formatMoney(total, currency)}\n\n` +
    `¿Confirmar esta reserva?`;

  const ok = confirm(summaryMsg);
  if (!ok) return null;

  return {
    name, age, destination: destination.name, currency,
    nights, activities, hotel, activitiesTotal, subtotal, taxes, total
  };
}


// Resumen del grupo y descuentos
function summarizeGroup(bookings) {
  const totalInCurrencyByDest = {}; 
  const totalInARS = bookings.reduce((acc, b) => {
    const tARS = convertToARS(b.total, b.currency);
    totalInCurrencyByDest[b.currency] = (totalInCurrencyByDest[b.currency] || 0) + b.total;
    return acc + tARS;
  }, 0);

  // Descuento por grupo
  let discountARS = 0;
  if (bookings.length > GROUP_DISCOUNT_THRESHOLD) {
    discountARS = totalInARS * GROUP_DISCOUNT_RATE;
  }
  const finalARS = totalInARS - discountARS;

  return { totalInCurrencyByDest, totalInARS, discountARS, finalARS };
}

function printSummary(bookings) {
  // Crear resumen para mostrar en pop-up
  let summaryText = "=== RESUMEN DE VIAJE ===\n\n";
  
  // Resumen individual
  summaryText += "VIAJEROS:\n";
  bookings.forEach((b, index) => {
    summaryText += `${index + 1}. ${b.name} (${b.age} años)\n`;
    summaryText += `   Destino: ${b.destination} - ${b.nights} noches\n`;
    summaryText += `   Total: ${formatMoney(b.total, b.currency)}\n\n`;
  });

  const group = summarizeGroup(bookings);
  
  // Totales por moneda
  summaryText += "TOTALES POR MONEDA:\n";
  Object.entries(group.totalInCurrencyByDest).forEach(([cur, amount]) => {
    summaryText += `• ${cur}: ${formatMoney(amount, cur)}\n`;
  });
  
  summaryText += `\nTOTAL ESTIMADO: ${formatMoney(group.totalInARS, 'ARS')}\n`;
  
  if (group.discountARS > 0) {
    summaryText += `Descuento por grupo (${(GROUP_DISCOUNT_RATE*100).toFixed(0)}%): -${formatMoney(group.discountARS, 'ARS')}\n`;
  }
  
  summaryText += `\n🎉 TOTAL FINAL: ${formatMoney(group.finalARS, 'ARS')}`;
  
  // Mostrar resumen en pop-up
  alert(summaryText);
  
  // Mantener también la salida en consola para información adicional
  console.log("=== RESUMEN INDIVIDUAL ===");
  console.table(bookings.map(b => ({
    Viajero: b.name,
    Edad: b.age,
    Destino: b.destination,
    Noches: b.nights,
    Moneda: b.currency,
    Total: b.total.toFixed(2)
  })));

  console.log("=== TOTALES POR MONEDA ===");
  Object.entries(group.totalInCurrencyByDest).forEach(([cur, amount]) => {
    console.log(`  ${cur}: ${amount.toFixed(2)} ${cur}`);
  });
  console.log(`Total estimado en ARS: ${group.totalInARS.toFixed(2)} ARS`);
  if (group.discountARS > 0) {
    console.log(`Descuento por grupo (${(GROUP_DISCOUNT_RATE*100).toFixed(0)}%): -${group.discountARS.toFixed(2)} ARS`);
  }
  console.log(`Total final en ARS: ${group.finalARS.toFixed(2)} ARS`);
}

// Función principal (invocación)
function runSimulator() {
  alert("¡Bienvenido/a al Simulador de Viaje!\n\nVas a completar datos por viajero.\nAl final verás un resumen completo de tu viaje.");

  bookings = []; // reset
  const travelers = promptNumber("¿Cuántos viajeros hay en el grupo?", { min: 1, max: 20 });
  if (travelers === null) {
    alert("Simulador cancelado.");
    return;
  }

  for (let i = 0; i < travelers; i++) {
    const booking = collectTravelerBooking(i);
    if (booking) {
      bookings.push(booking);
    } else {
      alert("Reserva omitida para este viajero.");
    }
  }

  if (bookings.length === 0) {
    alert("No hay reservas confirmadas. Fin del simulador.");
    return;
  }

  printSummary(bookings);
}

window.runSimulator = runSimulator;
