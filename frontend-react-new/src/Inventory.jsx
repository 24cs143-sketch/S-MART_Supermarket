import { useState, useEffect } from "react";
import "./Inventory.css";

const API_URL = "http://localhost:5000/api/products";

function Inventory({ setPage }) {
  const defaultProducts = [
    { id: 1, name: "Rice", category: "Grocery", unit: "kg", stock: 20 },
    { id: 2, name: "Wheat Flour", category: "Grocery", unit: "kg", stock: 20 },
    { id: 3, name: "Milk", category: "Dairy", unit: "litre", stock: 20 },
    { id: 4, name: "Bread", category: "Bakery", unit: "packet", stock: 20 },
    { id: 5, name: "Apple", category: "Fruits", unit: "kg", stock: 20 },
    { id: 6, name: "Banana", category: "Fruits", unit: "dozen", stock: 20 },
    { id: 7, name: "Orange", category: "Fruits", unit: "kg", stock: 20 },
    { id: 8, name: "Tomato", category: "Vegetables", unit: "kg", stock: 20 },
    { id: 9, name: "Carrot", category: "Vegetables", unit: "kg", stock: 20 },
    { id: 10, name: "Potato", category: "Vegetables", unit: "kg", stock: 20 },
    { id: 11, name: "Biscuits", category: "Snacks", unit: "packet", stock: 20 },
    { id: 12, name: "Chips", category: "Snacks", unit: "packet", stock: 20 },
  ];

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOCAL DATA =================

  function getLocalProducts() {
    try {
      const data = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function getSavedStock() {
    try {
      const data = JSON.parse(
        localStorage.getItem("defaultProductStock") || "{}"
      );

      return data && typeof data === "object" ? data : {};
    } catch {
      return {};
    }
  }

  // ================= LOAD PRODUCTS =================

  async function loadProducts() {
    try {
      setLoading(true);

      const savedStock = getSavedStock();

      const updatedDefaults = defaultProducts.map((product) => ({
        ...product,
        stock:
          savedStock[product.id] !== undefined
            ? Number(savedStock[product.id])
            : product.stock,
      }));

      let backendProducts = [];

      try {
        const response = await fetch(API_URL);

        if (response.ok) {
          const data = await response.json();

          backendProducts = Array.isArray(data)
            ? data.map((product) => ({
                ...product,
                id: product._id,
                isMongoProduct: true,
              }))
            : [];
        }
      } catch (error) {
        console.error("Backend loading error:", error);
      }

      const localProducts = getLocalProducts();

      const backendNames = [
        ...backendProducts,
        ...localProducts,
      ].map((product) =>
        String(product.name || "").trim().toLowerCase()
      );

      const filteredDefaults = updatedDefaults.filter(
        (product) =>
          !backendNames.includes(
            String(product.name).trim().toLowerCase()
          )
      );

      const mergedProducts = [
        ...backendProducts,
        ...localProducts.filter(
          (localProduct) =>
            !backendProducts.some(
              (backendProduct) =>
                String(backendProduct.name).trim().toLowerCase() ===
                String(localProduct.name).trim().toLowerCase()
            )
        ),
        ...filteredDefaults,
      ];

      const uniqueProducts = [];
      const names = new Set();

      mergedProducts.forEach((product) => {
        const name = String(product.name || "")
          .trim()
          .toLowerCase();

        if (!names.has(name)) {
          names.add(name);
          uniqueProducts.push(product);
        }
      });

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Inventory error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // ================= OPEN UPDATE MODAL =================

  function updateStock(product) {
    setSelectedProduct(product);
    setNewStock(String(product.stock ?? 0));
  }

  function closeStockModal() {
    setSelectedProduct(null);
    setNewStock("");
  }

  // ================= SAVE STOCK =================

  async function saveStockUpdate() {
    if (newStock === "" || !Number.isFinite(Number(newStock))) {
      alert("Please enter a valid stock quantity!");
      return;
    }

    const stockValue = Number(newStock);

    if (stockValue < 0) {
      alert("Stock cannot be negative!");
      return;
    }

    if (!selectedProduct) return;

    const product = selectedProduct;
    const mongoId = product._id;

    try {
      setLoading(true);

      // MongoDB product update
      if (mongoId) {
        console.log("UPDATING MONGODB STOCK:", mongoId);

        const response = await fetch(
          `${API_URL}/${mongoId}/stock`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: stockValue,
            }),
          }
        );

        const result = await response.json();

        console.log("STOCK UPDATE RESPONSE:", result);

        if (!response.ok) {
          throw new Error(
            result.message || "MongoDB stock update failed"
          );
        }

        alert("MongoDB stock updated successfully! ✅");
      } else {
        // Default product stock update
        const savedStock = getSavedStock();

        savedStock[product.id] = stockValue;

        localStorage.setItem(
          "defaultProductStock",
          JSON.stringify(savedStock)
        );

        // Local admin product update
        const localProducts = getLocalProducts();

        const updatedLocalProducts = localProducts.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, stock: stockValue }
            : item
        );

        localStorage.setItem(
          "adminProducts",
          JSON.stringify(updatedLocalProducts)
        );

        alert("Local stock updated successfully! ✅");
      }

      await loadProducts();
      closeStockModal();
    } catch (error) {
      console.error("STOCK UPDATE ERROR:", error);
      alert(error.message || "Stock update failed");
    } finally {
      setLoading(false);
    }
  }

  // ================= FILTER =================

  const filteredProducts = products.filter((product) => {
    const matchesSearch = String(product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // ================= COUNTS =================

  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => Number(product.stock || 0) > 5
  ).length;

  const lowStock = products.filter((product) => {
    const stock = Number(product.stock || 0);
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;

  function getStockStatus(stock) {
    const value = Number(stock || 0);

    if (value <= 0) {
      return { text: "Out of Stock", className: "out" };
    }

    if (value <= 5) {
      return { text: "Low Stock", className: "low" };
    }

    return { text: "In Stock", className: "good" };
  }

  // ================= UI =================

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>📊 Inventory Management</h1>
          <p>Monitor and update supermarket stock</p>
        </div>

        <button
          className="back-admin-btn"
          onClick={() => setPage("admin")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat-card">
          <h3>📦 Total Products</h3>
          <strong>{totalProducts}</strong>
        </div>

        <div className="inventory-stat-card">
          <h3>🟢 In Stock</h3>
          <strong>{inStock}</strong>
        </div>

        <div className="inventory-stat-card">
          <h3>🟠 Low Stock</h3>
          <strong>{lowStock}</strong>
        </div>

        <div className="inventory-stat-card">
          <h3>🔴 Out of Stock</h3>
          <strong>{outOfStock}</strong>
        </div>
      </div>

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="🔍 Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Dairy">Dairy</option>
          <option value="Bakery">Bakery</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>

      <div className="inventory-table-container">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            <h2>🔍 No Products Found</h2>
            <p>Try another product name or category.</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock);

                return (
                  <tr key={product._id || product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>
                      <span className="inventory-category">
                        {product.category}
                      </span>
                    </td>

                    <td>
                      <strong>{product.unit || "piece"}</strong>
                    </td>

                    <td>
                      <strong>{product.stock}</strong>{" "}
                      {product.unit || "piece"}
                    </td>

                    <td>
                      <span
                        className={`inventory-status ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>

                    <td>
                      <button
                        className="update-stock-btn"
                        onClick={() => updateStock(product)}
                      >
                        ✏️ Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button
        className="back-admin-btn inventory-back"
        onClick={() => setPage("admin")}
      >
        ← Back to Admin Dashboard
      </button>

      {selectedProduct && (
        <div
          className="stock-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeStockModal();
            }
          }}
        >
          <div className="stock-modal">
            <button
              className="stock-modal-close"
              onClick={closeStockModal}
            >
              ✕
            </button>

            <div className="stock-modal-icon">📦</div>

            <h2>Update Stock</h2>

            <p className="stock-modal-product">
              {selectedProduct.name}
            </p>

            <p className="current-stock">
              Current Stock:{" "}
              <strong>
                {selectedProduct.stock}{" "}
                {selectedProduct.unit || "piece"}
              </strong>
            </p>

            <label>New Stock Quantity</label>

            <input
              type="number"
              min="0"
              step="1"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />

            <div className="stock-modal-actions">
              <button
                className="cancel-stock-btn"
                onClick={closeStockModal}
              >
                Cancel
              </button>

              <button
                className="save-stock-btn"
                onClick={saveStockUpdate}
                disabled={loading}
              >
                ✅ Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;