import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_URL, availabilityLabel } from "../config";
import { deleteProduct } from "./adminApi";

function AdminProducts() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

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
        setError("Could not load products. Is the server running?");
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

    setError("");
    setMessage("");

    try {
      await deleteProduct(product.productId);
      setMessage(`"${product.name}" was deleted.`);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="admin-title-row">
        <h1 className="admin-title">Products</h1>
        <Link to="/admin/products/add" className="admin-add">
          + Add Product
        </Link>
      </div>

      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="admin-thumb"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{availabilityLabel(product.availability)}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${product.productId}`}
                    className="admin-edit"
                  >
                    Edit
                  </Link>
                  <button
                    className="admin-delete"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && <p>No products yet.</p>}
      </div>
    </div>
  );
}

export default AdminProducts;