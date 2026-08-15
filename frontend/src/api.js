const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || "http://localhost:4001/api";
const TUTORING_API_URL = process.env.REACT_APP_TUTORING_API_URL || "http://localhost:4002/api";

function getToken() {
  return localStorage.getItem("htw_token");
}

async function request(baseUrl, path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const authApi = {
  register: (payload) =>
    request(AUTH_API_URL, "/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request(AUTH_API_URL, "/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request(AUTH_API_URL, "/auth/me"),
};

export const tutoringApi = {
  listTutors: (course) => request(TUTORING_API_URL, `/tutors${course ? `?course=${course}` : ""}`),
  getTutor: (id) => request(TUTORING_API_URL, `/tutors/${id}`),
  createTutor: (formData) =>
    request(TUTORING_API_URL, "/tutors", { method: "POST", body: formData }),
  createBooking: (payload) =>
    request(TUTORING_API_URL, "/bookings", { method: "POST", body: JSON.stringify(payload) }),
  myBookings: () => request(TUTORING_API_URL, "/bookings/me"),
};

export { getToken };
