import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { checkToken, clearToken } from "./adminApi";
import "./admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkToken().then((ok) => {
      if (!ok) {
        clearToken();
        navigate("/admin/login");
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  if (checking) {
    return <div className="admin-login-page">Checking login...</div>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Crochet Tales 🧶</div>

        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink to="/admin/products">Products</NavLink>
        </nav>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;