import React from "react";

import rice from "./assets/rice.jpg";
import apple from "./assets/apple.jpg";
import banana from "./assets/banana.jpg";
import tomato from "./assets/tomato.jpg";
import potato from "./assets/potato.jpg";
import chips from "./assets/chips.jpg";

function Home({ setPage }) {
  const categories = [
    ["Vegetables", "🥦", "Fresh vegetables", "#e9f8e9"],
    ["Fruits", "🍎", "Fresh & juicy fruits", "#fff1ed"],
    ["Grocery", "🛒", "Daily essentials", "#fff8df"],
    ["Dairy", "🥛", "Fresh dairy products", "#edf5ff"],
    ["Bakery", "🍞", "Fresh bakery items", "#fff0dc"],
    ["Snacks", "🍿", "Tasty snacks", "#f5edff"],
  ];

  const products = [
    ["Fresh Rice", "₹60 / kg", rice, "Best Seller"],
    ["Fresh Apple", "₹120 / kg", apple, "Fresh"],
    ["Banana", "₹50 / dozen", banana, "Popular"],
    ["Tomato", "₹50 / kg", tomato, "Farm Fresh"],
    ["Potato", "₹45 / kg", potato, "Best Price"],
    ["Chips", "₹40 / packet", chips, "Snack"],
  ];

  return (
    <div className="home-page">
      <div className="home-offer-bar">
        🚚 FREE DELIVERY above ₹499 | ⚡ Express delivery available
      </div>

      <section className="home-hero">
        <div className="hero-text">
          <span className="hero-small-title">🛒 WELCOME TO S MART</span>

          <h1>
            Fresh Groceries,
            <br />
            <span>Better Everyday</span>
          </h1>

          <p>
            Shop fresh fruits, vegetables, groceries, dairy products
            and snacks at the best prices.
          </p>

          <div className="hero-buttons">
            <button onClick={() => setPage("products")}>
              🛍️ Start Shopping
            </button>

            <button
              className="hero-outline-btn"
              onClick={() => setPage("products")}
            >
              Explore Products →
            </button>
          </div>

          <div className="hero-trust-points">
            ✓ Fresh Products &nbsp; ✓ Best Prices &nbsp; ✓ Fast Delivery
          </div>
        </div>

        <div className="hero-showcase-new">
          <div className="hero-green-card">
            <span className="fresh-tag">🌿 100% Fresh</span>

            <h2>
              Freshness
              <br />
              in Every Basket
            </h2>

            <p>Healthy choices for your everyday life</p>

            <div className="hero-large-image">
              <img src={tomato} alt="Tomato" />
              <img src={apple} alt="Apple" />
              <img src={banana} alt="Banana" />
              <img src={potato} alt="Potato" />
            </div>

            <button onClick={() => setPage("products")}>
              Shop Fresh Items →
            </button>
          </div>

          <div className="hero-product-tag hero-tag-one">
            <img src={tomato} alt="Tomato" />
            <div>
              <strong>Fresh Tomato</strong>
              <small>₹50 / kg</small>
            </div>
          </div>

          <div className="hero-product-tag hero-tag-two">
            <img src={apple} alt="Apple" />
            <div>
              <strong>Sweet Apple</strong>
              <small>₹120 / kg</small>
            </div>
          </div>

          <div className="hero-offer-circle">
            <strong>20%</strong>
            <span>OFF</span>
          </div>
        </div>
      </section>

      <section className="deal-section">
        <div>
          <span className="deal-label">🔥 DEAL OF THE DAY</span>
          <h2>Get 20% OFF</h2>
          <p>On selected fresh groceries and daily essentials.</p>
          <button onClick={() => setPage("products")}>
            Shop Deal →
          </button>
        </div>

        <div className="deal-emoji">🛒🥦🍎🥕</div>
      </section>

      <section className="home-features">
        {[
          ["🚚", "Fast Delivery", "Get your groceries delivered quickly."],
          ["🥬", "Fresh Products", "Fresh and quality products every day."],
          ["💰", "Best Prices", "Affordable prices for your daily needs."],
          ["🔒", "Secure Shopping", "Simple and secure shopping experience."],
        ].map((item) => (
          <div className="home-feature-card" key={item[1]}>
            <div>{item[0]}</div>
            <h3>{item[1]}</h3>
            <p>{item[2]}</p>
          </div>
        ))}
      </section>

      <section className="category-section">
        <div className="section-heading">
          <span>EXPLORE</span>
          <h2>Shop by Category</h2>
          <p>Everything you need in one place.</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <div
              className="home-category-card"
              key={category[0]}
              style={{ background: category[3] }}
              onClick={() => setPage("products")}
            >
              <div className="category-emoji">{category[1]}</div>
              <h3>{category[0]}</h3>
              <p>{category[2]}</p>
              <span>Shop Now →</span>
            </div>
          ))}
        </div>
      </section>

      <section className="special-offer">
        <div className="offer-icon">🎁</div>

        <div>
          <span>LIMITED TIME OFFER</span>
          <h2>Freshness delivered to your doorstep!</h2>
          <p>Enjoy great products, great prices and convenient shopping.</p>
        </div>

        <button onClick={() => setPage("products")}>Shop Now →</button>
      </section>

      <section className="best-selling">
        <div className="section-heading">
          <span>OUR PICKS</span>
          <h2>Best Selling Products</h2>
          <p>Our customers' favourite everyday products.</p>
        </div>

        <div className="home-product-grid">
          {products.map((product) => (
            <div className="home-product-card" key={product[0]}>
              <div className="product-badge">{product[3]}</div>

              <div className="home-product-image">
                <img src={product[2]} alt={product[0]} />
              </div>

              <div className="home-product-info">
                <h3>{product[0]}</h3>
                <p>{product[1]}</p>
                <button onClick={() => setPage("products")}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="why-text">
          <span>WHY S MART?</span>

          <h2>
            Everything fresh.
            <br />
            Everything simple.
          </h2>

          <p>
            S MART makes everyday grocery shopping easy, affordable
            and convenient for everyone.
          </p>

          <button onClick={() => setPage("products")}>
            Start Shopping →
          </button>
        </div>

        <div className="why-boxes">
          <div>
            <strong>100%</strong>
            <span>Fresh Products</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Easy Shopping</span>
          </div>
          <div>
            <strong>₹499+</strong>
            <span>Free Delivery</span>
          </div>
          <div>
            <strong>6+</strong>
            <span>Categories</span>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <h2>🛒 S MART</h2>
          <p>Fresh Groceries, Better Everyday.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <p onClick={() => setPage("home")}>Home</p>
          <p onClick={() => setPage("products")}>Products</p>
          <p onClick={() => setPage("cart")}>Cart</p>
          <p onClick={() => setPage("orders")}>My Orders</p>
        </div>

        <div>
          <h3>Contact</h3>
          <p>📞 +91 98765 43210</p>
          <p>📧 smart@gmail.com</p>
          <p>📍 Erode, Tamil Nadu</p>
        </div>
      </footer>

      <div className="copyright">
        © 2026 S MART. All Rights Reserved.
      </div>
    </div>
  );
}

export default Home;