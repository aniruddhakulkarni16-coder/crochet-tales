import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import { saveProduct, uploadImage } from "./adminApi";

const CATEGORIES = [
  "Toys",
  "Flowers",
  "Bags",
  "Accessories",
  "Baby",
  "Home Decor",
];

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Accessories",
    availability: "available",
    image: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description || "",
          price: String(p.price),
          category: p.category,
          availability: p.availability,
          image: p.image || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load this product.");
        setLoading(false);
      });
  }, [id, isEdit]);

  const change = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await saveProduct(isEdit ? id : null, {
        ...form,
        price: Number(form.price),
      });
      navigate("/admin/products", {
        state: { message: isEdit ? "Changes saved." : "Product added." },
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  const categoryList = CATEGORIES.includes(form.category)
    ? CATEGORIES
    : [...CATEGORIES, form.category];

  return (
    <div>
      <h1 className="admin-title">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input value={form.name} onChange={change("name")} required />

        <label>Description</label>
        <textarea
          rows="4"
          value={form.description}
          onChange={change("description")}
        />

        <label>Price (₹)</label>
        <input
          type="number"
          min="0"
          value={form.price}
          onChange={change("price")}
          required
        />

        <label>Category</label>
        <select value={form.category} onChange={change("category")}>
          {categoryList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Availability</label>
        <select value={form.availability} onChange={change("availability")}>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="coming_soon">Coming Soon</option>
        </select>

        <label>Product Image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          disabled={uploading}
        />
        {uploading && <p className="admin-hint">Uploading image...</p>}

        {form.image && (
          <img src={form.image} alt="Preview" className="admin-preview" />
        )}

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-form-buttons">
          <button
            type="submit"
            className="admin-save"
            disabled={busy || uploading}
          >
            {busy ? "Saving..." : "Save Changes"}
          </button>
          <Link to="/admin/products" className="admin-cancel">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;