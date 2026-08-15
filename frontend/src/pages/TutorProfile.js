import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutoringApi } from "../api";
import { useAuth } from "../AuthContext";

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [sessionDate, setSessionDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    tutoringApi
      .getTutor(id)
      .then((data) => setTutor(data.tutor))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleBooking(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await tutoringApi.createBooking({ tutorId: id, sessionDate });
      setMessage("Session booked! Check My Bookings for details.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!tutor) return <p>{error || "Loading tutor..."}</p>;

  return (
    <section className="tutor-profile">
      <img
        src={tutor.imageUrl || "https://via.placeholder.com/400x250?text=HTW+Tutor"}
        alt={tutor.name}
      />
      <div>
        <h2>{tutor.name}</h2>
        <p>{tutor.subject} &middot; {tutor.course}</p>
        <p>{tutor.bio}</p>
        <p className="price">€{tutor.pricePerHour}/hr</p>

        <form onSubmit={handleBooking} className="booking-form">
          <label>Select a session date & time</label>
          <input
            type="datetime-local"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            required
          />
          <button type="submit" className="button">Book Session</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
