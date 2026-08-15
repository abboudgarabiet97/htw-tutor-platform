import { useEffect, useState } from "react";
import { tutoringApi } from "../api";
import TutorCard from "../components/TutorCard";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    tutoringApi
      .listTutors(course)
      .then((data) => setTutors(data.tutors))
      .catch((err) => setError(err.message));
  }, [course]);

  return (
    <section>
      <h2>Find a Tutor</h2>
      <input
        placeholder="Filter by course code, e.g. INF101"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="filter-input"
      />
      {error && <p className="error">{error}</p>}
      <div className="tutor-grid">
        {tutors.map((tutor) => (
          <TutorCard key={tutor._id} tutor={tutor} />
        ))}
        {tutors.length === 0 && !error && <p>No tutors found yet. Be the first to register!</p>}
      </div>
    </section>
  );
}
