function App() {
  return (
    <div>
      <header>
        <h1>🛒 Smart Supermarket</h1>

        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/cart">Cart</a>
        </nav>
      </header>

      <main className="hero">
        <h2>Welcome to Smart Supermarket</h2>

        <p>
          Easy shopping, smart billing and convenient ordering.
        </p>

        <button>Shop Now</button>
      </main>
    </div>
  );
}

export default App;