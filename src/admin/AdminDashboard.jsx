import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Could not load products. Is the server running?");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="admin-error">{error}</div>;

  const total = products.length;
  const available = products.filter((p) => p.availability === "available").length;
  const outOfStock = products.filter((p) => p.availability === "out_of_stock").length;
  const comingSoon = products.filter((p) => p.availability === "coming_soon").length;

  const categoryCounts = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const categoryNames = Object.keys(categoryCounts);

  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>

      <div className="admin-cards">
        <div className="admin-card">
          <span>Total Products</span>
          <strong>{total}</strong>
        </div>
        <div className="admin-card">
          <span>Available</span>
          <strong>{available}</strong>
        </div>
        <div className="admin-card">
          <span>Unavailable</span>
          <strong>{total - available}</strong>
        </div>
        <div className="admin-card">
          <span>Categories</span>
          <strong>{categoryNames.length}</strong>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Availability breakdown</h2>
        <p>Available: {available}</p>
        <p>Out of Stock: {outOfStock}</p>
        <p>Coming Soon: {comingSoon}</p>
      </div>

      <div className="admin-panel">
        <h2>Products per category</h2>
        {categoryNames.map((name) => (
          <p key={name}>
            {name}: {categoryCounts[name]}
          </p>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;