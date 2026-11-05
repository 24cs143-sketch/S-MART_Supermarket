import { useEffect, useState } from "react";

import riceImg from "./assets/rice.jpg";
import wheatImg from "./assets/wheat.jpg";
import milkImg from "./assets/milk.jpg";
import breadImg from "./assets/bread.jpg";
import appleImg from "./assets/apple.jpg";
import bananaImg from "./assets/banana.jpg";
import orangeImg from "./assets/orange.jpg";
import tomatoImg from "./assets/tomato.jpg";
import carrotImg from "./assets/carrot.jpg";
import potatoImg from "./assets/potato.jpg";
import biscuitsImg from "./assets/biscuits.jpg";
import chipsImg from "./assets/chips.jpg";

const API_URL = "http://localhost:5000/api/products";

// ================= DEFAULT PRODUCTS =================

const defaultProducts = [
  { id: "default-rice", name: "Rice", price: 60, category: "Grocery", unit: "kg", stock: 20, image: riceImg },
  { id: "default-wheat", name: "Wheat Flour", price: 55, category: "Grocery", unit: "kg", stock: 20, image: wheatImg },
  { id: "default-milk", name: "Milk", price: 30, category: "Dairy", unit: "litre", stock: 20, image: milkImg },
  { id: "default-bread", name: "Bread", price: 40, category: "Bakery", unit: "packet", stock: 20, image: breadImg },
  { id: "default-apple", name: "Apple", price: 120, category: "Fruits", unit: "kg", stock: 20, image: appleImg },
  { id: "default-banana", name: "Banana", price: 50, category: "Fruits", unit: "dozen", stock: 20, image: bananaImg },
  { id: "default-orange", name: "Orange", price: 80, category: "Fruits", unit: "kg", stock: 20, image: orangeImg },
  { id: "default-tomato", name: "Tomato", price: 50, category: "Vegetables", unit: "kg", stock: 20, image: tomatoImg },
  { id: "default-carrot", name: "Carrot", price: 60, category: "Vegetables", unit: "kg", stock: 20, image: carrotImg },
  { id: "default-potato", name: "Potato", price: 45, category: "Vegetables", unit: "kg", stock: 20, image: potatoImg },
  { id: "default-biscuits", name: "Biscuits", price: 30, category: "Snacks", unit: "packet", stock: 20, image: biscuitsImg },
  { id: "default-chips", name: "Chips", price: 40, category: "Snacks", unit: "packet", stock: 20, image: chipsImg },
];

// ================= IMAGE MAP =================

const imageMap = {
  rice: riceImg,
  "wheat flour": wheatImg,
  milk: milkImg,
  bread: breadImg,
  apple: appleImg,
  banana: bananaImg,
  orange: orangeImg,
  tomato: tomatoImg,
  carrot: carrotImg,
  potato: potatoImg,
  biscuits: biscuitsImg,
  chips: chipsImg,
};

// ================= LOCAL STORAGE HELPERS =================

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`${key} reading error:`, error);
    return fallback;
  }
}

function getLocalProducts() {
  const data = readStorage("adminProducts", []);
  return Array.isArray(data) ? data : [];
}

function getDeletedProducts() {
  const data = readStorage("deletedProducts", []);
  return Array.isArray(data) ? data.map(String) : [];
}

function getSavedStock() {
  const data = readStorage("defaultProductStock", {});
  return data && typeof data === "object" && !Array.isArray(data)
    ? data
    : {};
}

function getCart() {
  const data = readStorage("cart", []);
  return Array.isArray(data) ? data : [];
}

// ================= PRODUCT HELPERS =================

function getProductId(product) {
  return String(product._id || product.id || getProductKey(product));
}

function getProductKey(product) {
  const name = String(product.name || "").trim().toLowerCase();
  const variant = String(product.variant || "standard").trim().toLowerCase();

  return `${name}__${variant}`;
}

function getProductImage(product) {
  if (product.image) return product.image;

  const name = String(product.name || "").trim().toLowerCase();
  return imageMap[name] || "";
}

function getMatchingDefaultProduct(product) {
  const key = getProductKey(product);

  return defaultProducts.find(
    (item) => getProductKey(item) === key
  );
}

function removeDeletedProducts(products) {
  const deletedIds = getDeletedProducts();

  return products.filter(
    (product) => !deletedIds.includes(getProductId(product))
  );
}

function removeDuplicateProducts(products) {
  const productMap = new Map();

  products.forEach((product) => {
    if (!product || !product.name) return;

    const key = getProductKey(product);

    const cleanProduct = {
      ...product,
      id: getProductId(product),
      name: String(product.name).trim(),
      price: Number(product.price || 0),
      stock: Math.max(0, Number(product.stock ?? 0)),
      category: product.category || "Grocery",
      unit: product.unit || "piece",
      variant: product.variant || "",
      image: getProductImage(product),
    };

    // Later entries replace earlier entries with the same product key.
    productMap.set(key, cleanProduct);
  });

  return Array.from(productMap.values());
}

function applySavedStock(products) {
  const savedStock = getSavedStock();

  return products.map((product) => {
    const defaultProduct = getMatchingDefaultProduct(product);
    const productId = getProductId(product);

    const stockKey = defaultProduct
      ? defaultProduct.id
      : productId;

    if (savedStock[stockKey] !== undefined) {
      return {
        ...product,
        stock: Number(savedStock[stockKey]),
      };
    }

    return product;
  });
}

function getAllProducts() {
  const savedStock = getSavedStock();

  const updatedDefaults = defaultProducts.map((product) => ({
    ...product,
    stock:
      savedStock[product.id] !== undefined
        ? Number(savedStock[product.id])
        : product.stock,
  }));

  const merged = [
    ...updatedDefaults,
    ...getLocalProducts(),
  ];

  return removeDuplicateProducts(
    removeDeletedProducts(merged)
  );
}

// ================= COMPONENT =================

function Products({ setPage }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ================= CART COUNT =================

  function updateCartCount() {
    const cart = getCart();

    setCartCount(
      cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      )
    );
  }

  // ================= LOAD PRODUCTS =================

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Backend products could not be loaded");
        }

        const backendProducts = await response.json();
        const deletedIds = getDeletedProducts();

        const visibleBackend = Array.isArray(backendProducts)
          ? backendProducts.filter(
              (product) =>
                !deletedIds.includes(getProductId(product))
            )
          : [];

        const visibleLocal = getLocalProducts().filter(
          (product) =>
            !deletedIds.includes(getProductId(product))
        );

        const backendWithImages = visibleBackend.map((product) => ({
          ...product,
          id: getProductId(product),
          image: getProductImage(product),
        }));

        const localWithImages = visibleLocal.map((product) => ({
          ...product,
          id: getProductId(product),
          image: getProductImage(product),
        }));

        const merged = [
          ...defaultProducts,
          ...backendWithImages,
          ...localWithImages,
        ];

        const finalProducts = applySavedStock(
          removeDuplicateProducts(
            removeDeletedProducts(merged)
          )
        );

        if (!cancelled) {
          setProducts(finalProducts);
        }
      } catch (error) {
        console.error("Products Loading Error:", error);

        if (!cancelled) {
          setProducts(getAllProducts());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    updateCartCount();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= SAVE STOCK =================

  async function updateStock(product, newStock) {
    const numericStock = Math.max(0, Number(newStock));
    const productId = getProductId(product);
    const defaultProduct = getMatchingDefaultProduct(product);

    // Save stock locally as a backup.
    try {
      const savedStock = getSavedStock();
      const stockKey = defaultProduct
        ? defaultProduct.id
        : productId;

      savedStock[stockKey] = numericStock;

      localStorage.setItem(
        "defaultProductStock",
        JSON.stringify(savedStock)
      );

      // Update local admin products, if applicable.
      const localProducts = getLocalProducts();

      const updatedLocalProducts = localProducts.map((item) =>
        getProductId(item) === productId
          ? { ...item, stock: numericStock }
          : item
      );

      if (
        updatedLocalProducts.some(
          (item) => getProductId(item) === productId
        )
      ) {
        localStorage.setItem(
          "adminProducts",
          JSON.stringify(updatedLocalProducts)
        );
      }
    } catch (error) {
      console.error("Local stock backup failed:", error);
    }

    // Update the displayed stock immediately.
    setProducts((previous) =>
      previous.map((item) =>
        getProductId(item) === productId
          ? { ...item, stock: numericStock }
          : item
      )
    );

    // Persist stock to MongoDB when this product has a database ID.
    if (product._id) {
      try {
        const response = await fetch(
          `${API_URL}/${product._id}/stock`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: numericStock,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Stock update failed"
          );
        }

        console.log(
          `${product.name} stock saved to MongoDB:`,
          numericStock
        );
      } catch (error) {
        console.error("MongoDB Stock Update Error:", error);
        alert(
          `Stock changed on screen, but database update failed for ${product.name}. Please check the backend.`
        );
      }
    } else {
      console.warn(
        `${product.name} has no MongoDB ID; only local stock was saved.`
      );
    }
  }

  // ================= QUANTITY CONTROLS =================

  function increaseQuantity(product) {
    const productId = getProductId(product);
    const current = Number(quantities[productId] || 1);
    const stock = Number(product.stock || 0);

    if (current >= stock) return;

    setQuantities((previous) => ({
      ...previous,
      [productId]: current + 1,
    }));
  }

  function decreaseQuantity(product) {
    const productId = getProductId(product);
    const current = Number(quantities[productId] || 1);

    if (current <= 1) return;

    setQuantities((previous) => ({
      ...previous,
      [productId]: current - 1,
    }));
  }

  // ================= ADD TO CART =================

  async function addToCart(product) {
    const productId = getProductId(product);
    const quantity = Number(quantities[productId] || 1);
    const availableStock = Number(product.stock || 0);

    if (quantity <= 0) {
      alert("Please select a valid quantity.");
      return;
    }

    if (availableStock <= 0) {
      alert("Product is out of stock!");
      return;
    }

    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    const cart = getCart();
    const productKey = getProductKey(product);

    const existingIndex = cart.findIndex(
      (item) => getProductKey(item) === productKey
    );

    const existingQuantity =
      existingIndex >= 0
        ? Number(cart[existingIndex].quantity || 0)
        : 0;

    // Avoid adding more than the currently available stock.
    if (existingQuantity + quantity > availableStock) {
      alert("Cart quantity exceeds available stock!");
      return;
    }

    let updatedCart;

    if (existingIndex >= 0) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              quantity: Number(item.quantity || 0) + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          id: productId,
          quantity,
        },
      ];
    }

    // Save cart first. If storage is full, do not reduce stock.
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Cart Storage Error:", error);
      alert(
        "Cart storage is full. Please clear old browser data or remove unnecessary cart items."
      );
      return;
    }

    // Reduce stock once, when adding to cart.
    await updateStock(product, availableStock - quantity);

    updateCartCount();

    setQuantities((previous) => ({
      ...previous,
      [productId]: 1,
    }));

    alert(`${product.name} added to cart! 🛒`);
  }

  // ================= SEARCH & CATEGORY =================

  const categories = [
    "All",
    "Grocery",
    "Dairy",
    "Bakery",
    "Fruits",
    "Vegetables",
    "Snacks",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = String(product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      String(product.category || "").toLowerCase() ===
        category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ================= UI =================

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>🛒 S MART Products</h1>

        <button onClick={() => setPage("cart")}>
          Cart ({cartCount})
        </button>
      </div>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <h3 className="loading-text">Loading products...</h3>
      ) : filteredProducts.length === 0 ? (
        <h3 className="empty-text">No products found</h3>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const productId = getProductId(product);
            const quantity = Number(quantities[productId] || 1);
            const stock = Number(product.stock || 0);

            return (
              <div className="product-card" key={productId}>
                <div className="product-image-container">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                <span className="product-category">
                  {product.category || "General"}
                </span>

                <h2>{product.name}</h2>
                <h3>₹{Number(product.price || 0)}</h3>

                <p>
                  Stock: {stock} {product.unit || "piece"}
                </p>

                <div className="quantity-controls">
                  <button
                    onClick={() => decreaseQuantity(product)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() => increaseQuantity(product)}
                    disabled={stock === 0 || quantity >= stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="add-cart-button"
                  disabled={stock === 0}
                  onClick={() => addToCart(product)}
                >
                  {stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;