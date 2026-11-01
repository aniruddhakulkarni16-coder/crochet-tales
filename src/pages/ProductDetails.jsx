import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, availabilityLabel } from "../config";
import { useAdmin } from "../admin/AdminContext";
import { deleteProduct } from "../admin/adminApi";
import YarnLoader from "../components/YarnLoader";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

    if (loading) {
    return <YarnLoader text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="not-found">
        <h1>Product Not Found</h1>

        <Link to="/products">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const isAvailable = product.availability === "available";
  const total = product.price * quantity;

  const handleDelete = async () => {
    const sure = window.confirm(
      "Are you sure you want to delete this product?\n\n" + product.name
    );
    if (!sure) return;

    try {
      await deleteProduct(product.productId);
      navigate("/products");
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const purchaseOnWhatsApp = () => {

    const phoneNumber = "8446100423";

    const message = `Hello! 👋

I would like to purchase:

Product: ${product.name}
Price: ₹${product.price}
Quantity: ${quantity}
Total: ₹${total}

Please Check Availability.

If available, please share the advance payment details.

After making the advance payment, I will send the payment confirmation.

Thank you! ❤️`;

    const whatsappURL =
      `https://wa.me/${phoneNumber}?text=` +
      encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  };

  return (

    <div className="details-page">

      <Link
        to="/products"
        className="back-link"
      >
        ← Back to Products
      </Link>

      {isAdmin && (
        <div className="owner-toolbar">
          <Link
            to={`/admin/products/edit/${product.productId}`}
            className="owner-add"
          >
            Edit this product
          </Link>
          <button className="owner-delete" onClick={handleDelete}>
            Delete
          </button>
          {adminError && <span>{adminError}</span>}
        </div>
      )}

      <div className="details-container">

        <div className="details-product-image">

          <img src={product.image} alt={product.name} />

          {!isAvailable && (
            <div className="large-unavailable">
              {availabilityLabel(product.availability)}
            </div>
          )}

        </div>

        <div className="details-information">

          <p className="details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-price">
            ₹{product.price}
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-line" />

          {isAvailable ? (

            <>
              <div className="availability-good">
                <span>●</span>
                Available for purchase
              </div>

              <div className="quantity-area">

                <span>Quantity</span>

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                  >
                    −
                  </button>

                  <strong>{quantity}</strong>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="total-area">

                <span>Total</span>

                <strong>
                  ₹{total}
                </strong>

              </div>

              <button
                className="whatsapp-order"
                onClick={purchaseOnWhatsApp}
              >
                <span>💬</span>

                Check Availability on WhatsApp

              </button>

              <p className="payment-note">
                You will first check availability
                with the owner. Advance payment is
                requested only after availability is
                confirmed.
              </p>

            </>

          ) : (

            <div className="unavailable-message">

              <h3>
                {product.availability === "coming_soon"
                  ? "This product is coming soon."
                  : "This product is currently out of stock."}
              </h3>

              <p>
                Please check our other handmade
                products.
              </p>

              <Link to="/products">
                Browse Other Products
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;