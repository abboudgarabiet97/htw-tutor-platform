import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tutoringApi } from "../api";

export default function CreateTutorProfile() {
  const [form, setForm] = useState({ name: "", subject: "", course: "", bio: "", pricePerHour: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);

      await tutoringApi.createTutor(formData);
      navigate("/tutors");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="form-page">
      <h2>Create Your Tutor Profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Subject</label>
        <input type="text" name="subject" value={form.subject} onChange={handleChange} required />

        <label>HTW Course Code</label>
        <input type="text" name="course" value={form.course} onChange={handleChange} required />

        <label>Short Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} />

        <label>Price per Hour (€)</label>
        <input type="number" name="pricePerHour" value={form.pricePerHour} onChange={handleChange} required min={1} />

        <label>Profile Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit" className="button">Create Profile</button>
      </form>
    </section>
  );
}
