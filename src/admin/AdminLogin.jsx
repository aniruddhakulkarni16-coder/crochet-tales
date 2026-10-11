import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, setToken } from "./adminApi";
import "./admin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const token = await loginRequest(email, password);
      setToken(token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p>Crochet Tales 🧶</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="admin-error">{error}</div>}

        <button type="submit" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;