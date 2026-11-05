import { useState } from "react";

function Cart({ setPage }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  function getAdminProducts() {
    try {
      return JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
      );
    } catch {
      return [];
    }
  }

  function getSavedStock() {
    try {
      return JSON.parse(
        localStorage.getItem("defaultProductStock") || "{}"
      );
    } catch {
      return {};
    }
  }

  function saveCart(updatedCart) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function getAvailableStock(item) {
    const itemId = String(item.id);

    const adminProducts = getAdminProducts();

    const adminProduct = adminProducts.find(
      (product) => String(product.id) === itemId
    );

    if (adminProduct) {
      return (
        Number(adminProduct.stock || 0) +
        Number(item.quantity || 1)
      );
    }

    const savedStock = getSavedStock();

    if (savedStock[itemId] !== undefined) {
      return (
        Number(savedStock[itemId]) +
        Number(item.quantity || 1)
      );
    }

    return Number(item.stock || 0);
  }

  function updateStock(item, newStock) {
    const itemId = String(item.id);
    const safeStock = Math.max(0, Number(newStock) || 0);

    const adminProducts = getAdminProducts();

    const isAdminProduct = adminProducts.some(
      (product) => String(product.id) === itemId
    );

    if (isAdminProduct) {
      const updatedAdminProducts = adminProducts.map((product) =>
        String(product.id) === itemId
          ? {
              ...product,
              stock: safeStock,
            }
          : product
      );

      localStorage.setItem(
        "adminProducts",
        JSON.stringify(updatedAdminProducts)
      );

      return;
    }

    const savedStock = getSavedStock();
    savedStock[itemId] = safeStock;

    localStorage.setItem(
      "defaultProductStock",
      JSON.stringify(savedStock)
    );
  }

  function increaseQuantity(index) {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    const currentQuantity = Number(item.quantity || 1);
    const availableStock = getAvailableStock(item);

    if (currentQuantity >= availableStock) {
      alert(
        `Only ${availableStock} ${
          item.unit || "piece"
        } available!`
      );
      return;
    }

    const newQuantity = currentQuantity + 1;

    updatedCart[index] = {
      ...item,
      quantity: newQuantity,
    };

    updateStock(item, availableStock - 1);
    saveCart(updatedCart);
  }

  function decreaseQuantity(index) {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    const currentQuantity = Number(item.quantity || 1);

    if (currentQuantity <= 1) {
      return;
    }

    const availableStock = getAvailableStock(item);
    const newQuantity = currentQuantity - 1;

    updatedCart[index] = {
      ...item,
      quantity: newQuantity,
    };

    updateStock(item, availableStock + 1);
    saveCart(updatedCart);
  }

  function removeItem(index) {
    const item = cart[index];

    const confirmRemove = window.confirm(
      `Remove ${item.name} from cart?`
    );

    if (!confirmRemove) {
      return;
    }

    const availableStock = getAvailableStock(item);

    updateStock(item, availableStock);

    const updatedCart = cart.filter(
      (_, itemIndex) => itemIndex !== index
    );

    saveCart(updatedCart);
  }

  function clearCart() {
    if (cart.length === 0) {
      return;
    }

    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) {
      return;
    }

    cart.forEach((item) => {
      const availableStock = getAvailableStock(item);
      updateStock(item, availableStock);
    });

    saveCart([]);
  }

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const itemCount = cart.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <h1>🛒 Shopping Cart</h1>
          <p>Review your selected products</p>
        </div>

        {cart.length > 0 && (
          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            🗑️ Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <button onClick={() => setPage("products")}>
            🛍️ Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Your Items</h2>
              <span>{itemCount} Items</span>
            </div>

            {cart.map((item, index) => {
              const quantity = Number(item.quantity || 1);
              const itemTotal =
                Number(item.price || 0) * quantity;
              const unit = item.unit || "piece";

              return (
                <div
                  className="cart-item-card"
                  key={`${String(item.id)}-${index}`}
                >
                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <div>🛍️</div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <span className="cart-item-category">
                      {item.category}
                    </span>

                    <h3>{item.name}</h3>

                    <p className="cart-item-price">
                      ₹{item.price} / {unit}
                    </p>

                    <p className="cart-item-quantity-text">
                      Quantity: {quantity} {unit}
                    </p>
                  </div>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(index)}
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(index)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <strong>₹{itemTotal}</strong>

                    <small>
                      {quantity} {unit}
                    </small>

                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(index)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              className="continue-shopping-btn"
              onClick={() => setPage("products")}
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="cart-summary">
            <h2>🧾 Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <strong>{itemCount}</strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{total}</strong>
            </div>

            <div className="summary-row">
              <span>🚚 Delivery</span>
              <strong className="free">FREE</strong>
            </div>

            <hr />

            <div className="cart-grand-total">
              <span>Grand Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="proceed-checkout-btn"
              onClick={() => setPage("checkout")}
            >
              🧾 Proceed to Checkout →
            </button>

            <div className="cart-security">
              🔒 Secure & Safe Checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;