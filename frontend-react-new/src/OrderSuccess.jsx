import { useEffect, useState } from "react";

function OrderSuccess({ setPage }) {

  const [order, setOrder] = useState(null);

  // =================================================
  // GET LATEST ORDER
  // =================================================

  useEffect(() => {

    const orders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    if (orders.length > 0) {

      const latestOrder =
        orders[orders.length - 1];

      setOrder(latestOrder);

    }

  }, []);


  // =================================================
  // NO ORDER
  // =================================================

  if (!order) {

    return (

      <div className="order-success-page">

        <div className="success-card">

          <div className="success-icon">
            📦
          </div>

          <h1>
            No Order Found
          </h1>

          <p>
            There is no recent order to display.
          </p>

          <button
            onClick={() =>
              setPage("products")
            }
          >
            🛍️ Continue Shopping
          </button>

        </div>

      </div>

    );

  }


  // =================================================
  // ORDER TOTAL
  // =================================================

  const total =
    Number(order.total || 0);


  // =================================================
  // ITEMS
  // =================================================

  const items =
    order.items || [];


  // =================================================
  // UI
  // =================================================

  return (

    <div className="order-success-page">

      <div className="success-card">


        {/* ================================================= */}
        {/* SUCCESS ICON */}
        {/* ================================================= */}

        <div className="success-icon">

          ✅

        </div>


        {/* ================================================= */}
        {/* SUCCESS MESSAGE */}
        {/* ================================================= */}

        <h1>
          Order Placed Successfully! 🎉
        </h1>

        <p className="success-message">

          Thank you for shopping with
          <strong> S MART </strong>!

        </p>


        <p>

          Your order has been successfully placed.

        </p>


        {/* ================================================= */}
        {/* ORDER ID */}
        {/* ================================================= */}

        <div className="success-order-id">

          <span>
            Order ID
          </span>

          <strong>
            #{order.id}
          </strong>

        </div>


        {/* ================================================= */}
        {/* CUSTOMER DETAILS */}
        {/* ================================================= */}

        <div className="success-section">

          <h2>
            👤 Customer Details
          </h2>


          <div className="success-info">

            <p>

              <strong>
                Name:
              </strong>{" "}

              {order.customerName ||
                "Customer"}

            </p>


            <p>

              <strong>
                Phone:
              </strong>{" "}

              {order.phone ||
                "Not provided"}

            </p>


            <p>

              <strong>
                Address:
              </strong>{" "}

              {order.address ||
                "Not provided"}

            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* ORDERED PRODUCTS */}
        {/* ================================================= */}

        <div className="success-section">

          <h2>
            🛒 Ordered Products
          </h2>


          <div className="success-items">

            {items.map(
              (item, index) => {

                const quantity =
                  Number(
                    item.quantity || 1
                  );


                const itemTotal =
                  Number(
                    item.price || 0
                  ) *
                  quantity;


                const unit =
                  item.unit ||
                  "piece";


                return (

                  <div
                    className="success-item"
                    key={`${item.id}-${index}`}
                  >


                    {/* IMAGE */}

                    <div className="success-item-image">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                      ) : (

                        <div className="no-image">
                          🛍️
                        </div>

                      )}

                    </div>


                    {/* DETAILS */}

                    <div className="success-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p>

                        ₹{item.price}

                        {" / "}

                        {unit}

                      </p>

                      <p>

                        Quantity:

                        {" "}

                        <strong>
                          {quantity} {unit}
                        </strong>

                      </p>

                    </div>


                    {/* TOTAL */}

                    <div className="success-item-total">

                      <strong>
                        ₹{itemTotal}
                      </strong>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* PAYMENT + TOTAL */}
        {/* ================================================= */}

        <div className="success-summary">


          <div className="success-summary-row">

            <span>
              💰 Order Total
            </span>

            <strong>
              ₹{total}
            </strong>

          </div>


          <div className="success-summary-row">

            <span>
              💵 Payment Method
            </span>

            <strong>
              {order.payment ||
                "Cash on Delivery"}
            </strong>

          </div>


          <div className="success-summary-row">

            <span>
              📦 Order Status
            </span>

            <strong>
              {order.status ||
                "Order Placed"}
            </strong>

          </div>


          <div className="success-summary-row">

            <span>
              📅 Order Date
            </span>

            <strong>
              {order.date ||
                "N/A"}
            </strong>

          </div>


        </div>


        {/* ================================================= */}
        {/* COD MESSAGE */}
        {/* ================================================= */}

        <div className="cod-message">

          💵 <strong>Cash on Delivery</strong>

          <p>
            Please pay ₹{total} when your order
            is delivered.
          </p>

        </div>


        {/* ================================================= */}
        {/* BUTTONS */}
        {/* ================================================= */}

        <div className="success-buttons">


          <button
            className="success-orders-btn"
            onClick={() =>
              setPage("orders")
            }
          >
            📦 View My Orders
          </button>


          <button
            className="success-shopping-btn"
            onClick={() =>
              setPage("products")
            }
          >
            🛍️ Continue Shopping
          </button>


          <button
            className="success-home-btn"
            onClick={() =>
              setPage("home")
            }
          >
            🏠 Back to Home
          </button>


        </div>


        {/* ================================================= */}
        {/* SECURITY */}
        {/* ================================================= */}

        <p className="success-security">

          🔒 Your order details have been securely saved.

        </p>


      </div>

    </div>

  );

}


export default OrderSuccess;