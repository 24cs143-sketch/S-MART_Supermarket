import { useState } from "react";

function Checkout({ setPage }) {

  // =================================================
  // GET CART
  // =================================================

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];


  // =================================================
  // FORM STATES
  // =================================================

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");


  // =================================================
  // TOTAL ITEMS
  // =================================================

  const itemCount =
    cart.reduce(
      (count, item) =>
        count +
        Number(item.quantity || 1),
      0
    );


  // =================================================
  // TOTAL PRICE
  // =================================================

  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
        Number(item.quantity || 1),
      0
    );


  // =================================================
  // CONTINUE TO PAYMENT
  // =================================================

  function continueToPayment(e) {

    e.preventDefault();


    // ================= EMPTY CART =================

    if (cart.length === 0) {

      alert(
        "Your cart is empty!"
      );

      setPage("products");

      return;

    }


    // ================= NAME =================

    if (
      !customerName.trim()
    ) {

      alert(
        "Please enter your name."
      );

      return;

    }


    if (
      customerName.trim().length < 3
    ) {

      alert(
        "Name must contain at least 3 characters."
      );

      return;

    }


    // ================= PHONE =================

    if (!phone.trim()) {

      alert(
        "Please enter your phone number."
      );

      return;

    }


    if (
      !/^[0-9]{10}$/.test(phone)
    ) {

      alert(
        "Please enter a valid 10-digit phone number."
      );

      return;

    }


    // ================= ADDRESS =================

    if (
      !address.trim()
    ) {

      alert(
        "Please enter your delivery address."
      );

      return;

    }


    if (
      address.trim().length < 10
    ) {

      alert(
        "Please enter a complete delivery address."
      );

      return;

    }


    // =================================================
    // SAVE CHECKOUT DATA
    // =================================================

    const checkoutData = {

      customerName:
        customerName.trim(),

      phone:
        phone.trim(),

      address:
        address.trim(),

      itemCount:
        itemCount,

      total:
        total

    };


    localStorage.setItem(
      "checkoutData",
      JSON.stringify(
        checkoutData
      )
    );


    // =================================================
    // GO TO PAYMENT
    // =================================================

    setPage("payment");

  }


  // =================================================
  // UI
  // =================================================

  return (

    <div className="checkout-page">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="checkout-header">

        <div>

          <h1>
            🧾 Checkout
          </h1>

          <p>
            Enter your delivery details
          </p>

        </div>


        <div className="checkout-cart-count">

          🛒 {itemCount} Items

        </div>

      </div>


      {/* ================================================= */}
      {/* EMPTY CART */}
      {/* ================================================= */}

      {cart.length === 0 ? (

        <div className="checkout-empty">

          <div className="checkout-empty-icon">

            🛒

          </div>


          <h2>
            Your Cart is Empty
          </h2>


          <p>
            Please add products before checkout.
          </p>


          <button
            onClick={() =>
              setPage("products")
            }
          >

            🛍️ Go to Products

          </button>

        </div>

      ) : (

        <div className="checkout-content">


          {/* ================================================= */}
          {/* CUSTOMER DETAILS */}
          {/* ================================================= */}

          <div className="checkout-form-card">

            <h2>
              👤 Delivery Details
            </h2>


            <p className="checkout-description">

              Enter the details where you want
              your order to be delivered.

            </p>


            <form
              onSubmit={
                continueToPayment
              }
            >


              {/* ================= NAME ================= */}

              <div className="checkout-form-group">

                <label>
                  👤 Full Name
                </label>


                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ================= PHONE ================= */}

              <div className="checkout-form-group">

                <label>
                  📱 Phone Number
                </label>


                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

              </div>


              {/* ================= ADDRESS ================= */}

              <div className="checkout-form-group">

                <label>
                  🏠 Delivery Address
                </label>


                <textarea
                  rows="5"
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ================================================= */}
              {/* BUTTONS */}
              {/* ================================================= */}

              <div className="checkout-buttons">


                <button
                  type="button"
                  className="checkout-back-btn"
                  onClick={() =>
                    setPage("cart")
                  }
                >

                  ← Back to Cart

                </button>


                <button
                  type="submit"
                  className="checkout-payment-btn"
                >

                  Continue to Payment →

                </button>


              </div>

            </form>

          </div>


          {/* ================================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================================= */}

          <div className="checkout-summary">


            <h2>
              🛒 Order Summary
            </h2>


            {/* ================= ITEMS ================= */}

            <div className="checkout-items">

              {cart.map(
                (item, index) => {

                  const quantity =
                    Number(
                      item.quantity || 1
                    );


                  const unit =
                    item.unit ||
                    "piece";


                  const itemTotal =
                    Number(
                      item.price || 0
                    ) *
                    quantity;


                  return (

                    <div
                      className="checkout-item"
                      key={`${item.id}-${index}`}
                    >


                      <div>

                        <strong>
                          {item.name}
                        </strong>


                        <p>

                          {quantity}

                          {" "}

                          {unit}

                          {" × ₹"}

                          {item.price}

                        </p>

                      </div>


                      <strong>

                        ₹{itemTotal}

                      </strong>


                    </div>

                  );

                }
              )}

            </div>


            <hr />


            {/* ================= ITEM COUNT ================= */}

            <div className="checkout-summary-row">

              <span>
                Total Items
              </span>


              <strong>
                {itemCount}
              </strong>

            </div>


            {/* ================= SUBTOTAL ================= */}

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>


              <strong>
                ₹{total}
              </strong>

            </div>


            {/* ================= DELIVERY ================= */}

            <div className="checkout-summary-row">

              <span>
                🚚 Delivery
              </span>


              <strong>
                FREE
              </strong>

            </div>


            <hr />


            {/* ================= GRAND TOTAL ================= */}

            <div className="checkout-total">

              <span>
                Grand Total
              </span>


              <strong>
                ₹{total}
              </strong>

            </div>


            {/* ================= SECURITY ================= */}

            <div className="checkout-security">

              🔒 Secure Checkout

            </div>

          </div>


        </div>

      )}

    </div>

  );

}


export default Checkout;