import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";
import { AdminProvider, useAdmin } from "./admin/AdminContext";
import RequireAdmin from "./admin/RequireAdmin";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

function PublicLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .stitch-divider");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <div key={"thread-" + pathname} className="route-thread" aria-hidden="true" />
      <Navbar />
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <p className="small-title">HANDMADE WITH LOVE ❤️</p>

          <h1>
            Little Loops.
            <br />
            Big Love.
          </h1>

          <p className="hero-description">
            Discover unique handmade crochet creations made specially for you,
            one stitch at a time.
          </p>

          <Link to="/products" className="shop-button">
            Explore Collection →
          </Link>
        </div>

        <svg
          className="hero-thread"
          viewBox="0 0 1200 120"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <path
            pathLength="100"
            d="M0 80 C150 20, 250 120, 400 70 S650 10, 780 65 C840 95, 900 40, 860 35 C820 30, 820 85, 880 85 S1050 40, 1200 70"
          />
        </svg>
      </section>

      
    
      <div className="stitch-divider" aria-hidden="true" />

      <section className="story" id="about">
                        <div className="story-design reveal">
          <img
            src="/images/frontend.jpeg"
            alt="Hands crocheting with green yarn"
            loading="lazy"
          />

          <svg
            className="story-border"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="story-ring"
              d="M0 50 A50 50 0 0 1 50 0 A50 50 0 0 1 100 50 L100 55 A45 45 0 0 1 55 100 L45 100 A45 45 0 0 1 0 55 Z"
            />
            <path
              className="story-stitches"
              d="M0 50 A50 50 0 0 1 50 0 A50 50 0 0 1 100 50 L100 55 A45 45 0 0 1 55 100 L45 100 A45 45 0 0 1 0 55 Z"
            />
          </svg>
        </div>

        <div className="story-content reveal">
          <p>THE STORY BEHIND THE STITCH</p>

          <h2>
            Handmade isn't
            <br />
            just a product.
            <br />
            It's a feeling.
          </h2>

          <span>
            Crochet Tales is built around the simple joy of creating something
            beautiful by hand. Every piece takes time, patience and lots of
            love.
          </span>

          <Link to="/products" className="story-button">
            Discover Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}

function AdminLoginRedirect() {
  const { openLogin } = useAdmin();

  useEffect(() => {
    openLogin();
  }, [openLogin]);

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route element={<RequireAdmin />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminProductForm />} />
              <Route
                path="/admin/products/edit/:id"
                element={<AdminProductForm />}
              />
            </Route>
          </Route>

          <Route path="/admin/login" element={<AdminLoginRedirect />} />
        </Routes>

        <LoginModal />
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;