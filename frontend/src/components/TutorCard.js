import { Link } from "react-router-dom";

export default function TutorCard({ tutor }) {
  return (
    <Link to={`/tutors/${tutor._id}`} className="tutor-card">
      <img
        src={tutor.imageUrl || "https://via.placeholder.com/300x200?text=HTW+Tutor"}
        alt={tutor.name}
      />
      <div className="tutor-card-body">
        <h3>{tutor.name}</h3>
        <p>{tutor.subject} &middot; {tutor.course}</p>
        <p className="price">€{tutor.pricePerHour}/hr</p>
      </div>
    </Link>
  );
}
