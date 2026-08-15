import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">HTW Tutor</Link>
      <nav>
        <Link to="/tutors">Find a Tutor</Link>
        {user && <Link to="/dashboard">My Bookings</Link>}
        {user && <Link to="/become-a-tutor">Become a Tutor</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button className="link-button" onClick={handleLogout}>
            Logout ({user.name})
          </button>
        )}
      </nav>
    </header>
  );
}
