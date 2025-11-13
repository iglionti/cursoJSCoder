function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    showError('No se pudo guardar la información localmente.');
    return false;
  }
}

function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

function saveCurrentBookings(bookings) {
  const data = {
    bookings: bookings,
    timestamp: new Date().toISOString()
  };
  return saveToLocalStorage('travelBookings', data);
}

function loadCurrentBookings() {
  const data = loadFromLocalStorage('travelBookings');
  return data ? data.bookings : [];
}

function clearCurrentBookings() {
  return removeFromLocalStorage('travelBookings');
}

function saveBookingHistory(booking) {
  try {
    const history = loadBookingHistory();
    const bookingWithId = {
      ...booking,
      id: Date.now(),
      confirmedAt: new Date().toISOString()
    };
    history.unshift(bookingWithId);
    
    if (history.length > 10) {
      history.pop();
    }
    
    return saveToLocalStorage('bookingHistory', history);
  } catch (error) {
    console.error('Error saving booking history:', error);
    return false;
  }
}

function loadBookingHistory() {
  const history = loadFromLocalStorage('bookingHistory');
  return history || [];
}

function clearBookingHistory() {
  return removeFromLocalStorage('bookingHistory');
}
