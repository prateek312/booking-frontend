import React, { useState, useEffect } from 'react';
import './App.css';

const bookingURL = "http://localhost:8080/bookings";
const blockingURL = "http://localhost:8080/blockings";

const App = () => {
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([{ startDate: '', endDate: '' }]);
  const [newBooking, setNewBooking] = useState({ startDate: '', endDate: '' });
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchBlockedDates();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(bookingURL, {
        mode: 'cors'
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(blockingURL, {
        mode: 'cors'
      });
      const data = await response.json();
      setBlockedDates(data);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const createBooking = async () => {
    try {
      const response = await fetch(bookingURL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      const data = await response.json();
      setBookings([...bookings, data]);
      setNewBooking({ startDate: '', endDate: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const updateBooking = async (id, startDate, endDate) => {
    try {
      const response = await fetch(bookingURL + `/${id}/rebook`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBooking),
      });
      const data = await response.json();
      const updatedBookings = bookings.map((booking) => (booking.id === id ? data : booking));
      setBookings(updatedBookings);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await fetch(bookingURL + `/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      const filteredBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="container">
      <h1>Booking Management</h1>

      <div className="section">
        <h2>Create Booking</h2>
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={newBooking.startDate}
            onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={newBooking.endDate}
            onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
          />
        </div>
        <button className="btn-primary" onClick={createBooking}>Create</button>
      </div>

      <div className="section">
        <h2>My Bookings</h2>
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-item">
              <div>
                <strong>Start Date:</strong> {booking.startDate}
              </div>
              <div>
                <strong>End Date:</strong> {booking.endDate}
              </div>
              <div className="booking-actions">
                <button className="btn-secondary" onClick={() => setSelectedBooking(booking)}>Edit</button>
                <button className="btn-secondary" onClick={() => deleteBooking(booking.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedBooking && (
        <div className="section">
          <h2>Edit Booking</h2>
          <div className="form-group">
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              type="date"
              value={selectedBooking.startDate}
              onChange={(e) => setSelectedBooking({ ...selectedBooking, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              type="date"
              value={selectedBooking.endDate}
              onChange={(e) => setSelectedBooking({ ...selectedBooking, endDate: e.target.value })}
            />
          </div>
          <div className="booking-actions">
            <button className="btn-primary" onClick={() => updateBooking(selectedBooking.id, selectedBooking.startDate, selectedBooking.endDate)}>Save</button>
            <button className="btn-secondary" onClick={() => setSelectedBooking(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="section">
        <h2>Blocked Dates</h2>
        <ul className="booking-list">
          {blockedDates.map((blockedDate) => (
            <li key={blockedDate.id} className="booking-item">
              <div>
                <strong>Start Date:</strong> {blockedDate.startDate}
              </div>
              <div>
                <strong>End Date:</strong> {blockedDate.endDate}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
