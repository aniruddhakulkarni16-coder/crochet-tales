import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL, availabilityLabel } from "../config";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
    return (
      <div className="not-found">
        <h1>Loading...</h1>
      </div>
    );
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

      <div className="details-container">

        <div className="details-product-image">

          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }}
          />

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