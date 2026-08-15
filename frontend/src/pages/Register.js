import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await authApi.register(form);
      login(data.token, data.user);
      navigate("/tutors");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="form-page">
      <h2>Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>HTW Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />

        <label>I want to</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Find a tutor</option>
          <option value="tutor">Become a tutor</option>
        </select>

        <button type="submit" className="button">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </section>
  );
}
