import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Private Tutoring for HTW Students</h1>
      <p>
        HTW Tutor connects HTW University of Applied Sciences students with
        experienced peer tutors for one-on-one help in any course &mdash;
        from Software Engineering to Business Administration.
      </p>
      <div className="hero-actions">
        <Link to="/tutors" className="button">Find a Tutor</Link>
        <Link to="/register" className="button secondary">Get Started</Link>
      </div>

      <div className="feature-grid">
        <div className="feature">
          <h3>Verified HTW Tutors</h3>
          <p>Every tutor is an HTW student or alumnus with proven course experience.</p>
        </div>
        <div className="feature">
          <h3>Book in Minutes</h3>
          <p>Pick a subject, choose a time, and confirm your session instantly.</p>
        </div>
        <div className="feature">
          <h3>Flexible Sessions</h3>
          <p>Get help with assignments, exam prep, or ongoing weekly coaching.</p>
        </div>
      </div>
    </section>
  );
}
