import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";

function Home() {

  return (

    <div>

      <nav className="navbar">

        <Link
          to="/"
          className="logo"
        >
          Crochet Tales 🧶
        </Link>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <a href="#about">
            About
          </a>

        </div>

      </nav>


      <section className="hero">

        <div className="hero-content">

          <p className="small-title">
            HANDMADE WITH LOVE ❤️
          </p>

          <h1>
            Little Loops.
            <br />
            Big Love.
          </h1>

          <p className="hero-description">
            Discover unique handmade crochet
            creations made specially for you,
            one stitch at a time.
          </p>

          <Link
            to="/products"
            className="shop-button"
          >
            Explore Collection →
          </Link>

        </div>

      </section>


      <section className="home-products">

        <div className="section-title">

          <p>SHOP OUR FAVORITES</p>

          <h2>
            Made With Love
          </h2>

          <span>
            Handmade pieces for every special moment.
          </span>

        </div>

        <div className="mini-products">

          <div className="mini-card">
            <span>🧸</span>
            <h3>Crochet Toys</h3>
            <p>Soft little friends</p>
          </div>

          <div className="mini-card">
            <span>💐</span>
            <h3>Forever Flowers</h3>
            <p>Flowers that never fade</p>
          </div>

          <div className="mini-card">
            <span>👜</span>
            <h3>Handmade Bags</h3>
            <p>Beautiful everyday pieces</p>
          </div>

        </div>

        <div className="center-button">

          <Link
            to="/products"
            className="outline-button"
          >
            View All Products
          </Link>

        </div>

      </section>


      <section
        className="story"
        id="about"
      >

        <div className="story-design">
          🧶
        </div>

        <div className="story-content">

          <p>THE STORY BEHIND THE STITCH</p>

          <h2>
            Handmade isn't
            <br />
            just a product.
            <br />
            It's a feeling.
          </h2>

          <span>
            Crochet Tales is built around the
            simple joy of creating something
            beautiful by hand. Every piece takes
            time, patience and lots of love.
          </span>

          <Link
            to="/products"
            className="story-button"
          >
            Discover Our Collection
          </Link>

        </div>

      </section>


      <footer>

        <h3>
          Crochet Tales 🧶
        </h3>

        <p>
          Handmade with love, one stitch at a time.
        </p>

        <small>
          © 2026 Crochet Tales
        </small>

      </footer>

    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

            <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;