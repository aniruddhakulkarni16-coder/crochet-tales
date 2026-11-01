import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../admin/AdminContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout, openLogin } = useAdmin();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Crochet Tales 🧶
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${open ? "nav-open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/#about">About</Link>

          {isAdmin ? (
            <button className="nav-admin-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="nav-admin-btn"
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
            >
              Admin Login
            </button>
          )}
        </div>
      </nav>

      {isAdmin && (
        <div className="owner-bar">
          <strong>Admin mode</strong>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/products/add">+ Add Product</Link>
        </div>
      )}
    </>
  );
}

export default Navbar;