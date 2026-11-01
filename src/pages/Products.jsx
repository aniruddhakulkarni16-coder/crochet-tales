import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, availabilityLabel } from "../config";
import { useAdmin } from "../admin/AdminContext";
import { deleteProduct } from "../admin/adminApi";
import YarnLoader from "../components/YarnLoader";

function Products() {
  const { isAdmin } = useAdmin();
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  const loadProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const sure = window.confirm(
      "Are you sure you want to delete this product?\n\n" + product.name
    );
    if (!sure) return;

    try {
      await deleteProduct(product.productId);
      setAdminMessage(`"${product.name}" was deleted.`);
      loadProducts();
    } catch (err) {
      setAdminMessage(err.message);
    }
  };

  const categories = [
    "All",
    "Toys",
    "Flowers",
    "Bags",
    "Accessories",
    "Baby",
    "Home Decor",
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <div className="products-page">
      <section className="products-header">
        <p>HANDMADE COLLECTION</p>
        <h1>Our Crochet Products</h1>
        <span>Every piece is handmade with love and care.</span>
      </section>

      <div className="category-buttons">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "category-active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="owner-toolbar">
          <Link to="/admin/products/add" className="owner-add">
            + Add Product
          </Link>
          {adminMessage && <span>{adminMessage}</span>}
        </div>
      )}

      {loading && <YarnLoader text="Loading products..." />}

      {error && (
        <p style={{ textAlign: "center" }}>
          Could not load products. Please try again later.
        </p>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p style={{ textAlign: "center", color: "#806761" }}>
          No products in this category yet.
        </p>
      )}

      <section className="products-grid">
        {filteredProducts.map((product, index) => (
          <div
            className="shop-card"
            key={product.productId}
            style={{ "--i": index % 8 }}
          >
            <Link
              to={`/product/${product.productId}`}
              className="shop-card-image"
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
              />

              {product.availability !== "available" && (
                <div className="unavailable-badge">
                  {availabilityLabel(product.availability)}
                </div>
              )}
            </Link>

            <div className="shop-card-content">
              <p className="card-category">{product.category}</p>

              <h2>{product.name}</h2>

              <div className="card-bottom">
                <strong>₹{product.price}</strong>

                <Link to={`/product/${product.productId}`}>View →</Link>
              </div>

              {isAdmin && (
                <div className="owner-actions">
                  <Link to={`/admin/products/edit/${product.productId}`}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Products;