import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, setToken } from "../admin/adminApi";
import { useAdmin } from "../admin/AdminContext";
import "../admin/admin.css";

function LoginModal() {
  const { loginOpen, closeLogin, refresh } = useAdmin();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loginOpen) return;
    setError("");
    emailRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, closeLogin]);

  if (!loginOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const token = await loginRequest(email, password);
      setToken(token);
      await refresh();
      setPassword("");
      closeLogin();
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="login-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeLogin();
      }}
    >
      <div className="login-modal">
        <button className="login-close" aria-label="Close" onClick={closeLogin}>
          ×
        </button>

        <form className="admin-login-box" onSubmit={handleSubmit}>
          <h1>Admin Login</h1>
          <p>Crochet Tales 🧶</p>

          <label>Email</label>
          <input
            ref={emailRef}
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
    </div>
  );
}

export default LoginModal;