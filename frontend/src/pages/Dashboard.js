import { useEffect, useState } from "react";
import { tutoringApi } from "../api";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    tutoringApi
      .myBookings()
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h2>My Bookings</h2>
      {error && <p className="error">{error}</p>}
      <ul className="booking-list">
        {bookings.map((b) => (
          <li key={b._id}>
            <strong>{b.tutorId?.name}</strong> &mdash; {b.tutorId?.subject} ({b.tutorId?.course})
            <br />
            {new Date(b.sessionDate).toLocaleString()} &mdash; status: {b.status}
          </li>
        ))}
        {bookings.length === 0 && !error && <p>You have no bookings yet.</p>}
      </ul>
    </section>
  );
}
