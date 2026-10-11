import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, availabilityLabel } from "../config";

function Products() {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
  }, []);

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

        <span>
          Every piece is handmade with love and care.
        </span>

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

      {loading && (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      )}

      {error && (
        <p style={{ textAlign: "center" }}>
          Could not load products. Please try again later.
        </p>
      )}

      <section className="products-grid">

        {filteredProducts.map((product) => (

          <div className="shop-card" key={product.productId}>

            <Link
              to={`/product/${product.productId}`}
              className="shop-card-image"
            >

              <img src={product.image} alt={product.name} />

              {product.availability !== "available" && (
                <div className="unavailable-badge">
                  {availabilityLabel(product.availability)}
                </div>
              )}

            </Link>

            <div className="shop-card-content">

              <p className="card-category">
                {product.category}
              </p>

              <h2>{product.name}</h2>

              <div className="card-bottom">

                <strong>
                  ₹{product.price}
                </strong>

                <Link to={`/product/${product.productId}`}>
                  View →
                </Link>

              </div>

            </div>

          </div>

        ))}

      </section>

    </div>
  );
}

export default Products;