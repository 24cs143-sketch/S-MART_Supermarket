import { useState, useEffect } from "react";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api/products";

function AdminProducts({ setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    variant: "",
    price: "",
    category: "Grocery",
    unit: "kg",
    image: "",
    stock: "",
  });

  // ================= LOCAL PRODUCTS =================

  function getLocalProducts() {
    try {
      const data = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Local products error:", error);
      return [];
    }
  }

  // ================= DELETED PRODUCTS =================

  function getDeletedProducts() {
    try {
      const data = JSON.parse(
        localStorage.getItem("deletedProducts") || "[]"
      );

      return Array.isArray(data) ? data.map(String) : [];
    } catch (error) {
      return [];
    }
  }

  function saveDeletedProductId(id) {
    const deletedProducts = getDeletedProducts();
    const productId = String(id);

    if (!deletedProducts.includes(productId)) {
      deletedProducts.push(productId);
    }

    localStorage.setItem(
      "deletedProducts",
      JSON.stringify(deletedProducts)
    );
  }

  function removeDeletedProductId(id) {
    const updatedDeletedProducts = getDeletedProducts().filter(
      (productId) => productId !== String(id)
    );

    localStorage.setItem(
      "deletedProducts",
      JSON.stringify(updatedDeletedProducts)
    );
  }

  function removeDeletedProducts(list) {
    const deletedProducts = getDeletedProducts();

    return list.filter((product) => {
      const productId = product._id || product.id;

      return !deletedProducts.includes(String(productId));
    });
  }

  // ================= NORMALIZE PRODUCT =================

  function normalizeProduct(product) {
    return {
      ...product,

      // MongoDB product has _id
      // Local product has id
      id: product._id || product.id,

      // Identify MongoDB product
      isMongoProduct: Boolean(product._id),
    };
  }

  // ================= REMOVE DUPLICATES =================

  function removeDuplicates(list) {
    const uniqueProducts = [];
    const usedIds = new Set();

    list.forEach((product) => {
      const productId = product._id || product.id;

      // MongoDB ID or local ID duplicate check
      if (productId && usedIds.has(String(productId))) {
        return;
      }

      if (productId) {
        usedIds.add(String(productId));
      }

      const productName = String(product.name || "")
        .trim()
        .toLowerCase();

      const productVariant = String(
        product.variant || "Standard"
      )
        .trim()
        .toLowerCase();

      const alreadyExists = uniqueProducts.some((item) => {
        const itemName = String(item.name || "")
          .trim()
          .toLowerCase();

        const itemVariant = String(
          item.variant || "Standard"
        )
          .trim()
          .toLowerCase();

        return (
          itemName === productName &&
          itemVariant === productVariant
        );
      });

      if (!alreadyExists) {
        uniqueProducts.push(product);
      }
    });

    return uniqueProducts;
  }

  // ================= LOAD PRODUCTS =================

  useEffect(() => {
    console.log("ADMIN PRODUCTS PAGE LOADED");

    async function loadProducts() {
      try {
        setLoading(true);

        const localProducts = removeDeletedProducts(
          getLocalProducts()
        );

        console.log("LOADING PRODUCTS FROM:", API_URL);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Backend loading failed");
        }

        const backendProducts = await response.json();

        console.log(
          "PRODUCTS FROM MONGODB:",
          backendProducts
        );

        const normalizedBackendProducts =
          Array.isArray(backendProducts)
            ? backendProducts.map(normalizeProduct)
            : [];

        const visibleBackendProducts =
          removeDeletedProducts(normalizedBackendProducts);

        // MongoDB products first
        const mergedProducts = [
          ...visibleBackendProducts,
        ];

        // Add local-only products
        localProducts.forEach((localProduct) => {
          const localId = localProduct._id || localProduct.id;

          const exists = mergedProducts.some((product) => {
            const backendId = product._id || product.id;

            return (
              String(backendId) === String(localId) ||
              (
                String(product.name || "")
                  .trim()
                  .toLowerCase() ===
                  String(localProduct.name || "")
                    .trim()
                    .toLowerCase() &&
                String(product.variant || "Standard")
                  .trim()
                  .toLowerCase() ===
                  String(localProduct.variant || "Standard")
                    .trim()
                    .toLowerCase()
              )
            );
          });

          if (!exists) {
            mergedProducts.push(
              normalizeProduct(localProduct)
            );
          }
        });

        const finalProducts = removeDeletedProducts(
          removeDuplicates(mergedProducts)
        );

        setProducts(finalProducts);

        localStorage.setItem(
          "adminProducts",
          JSON.stringify(finalProducts)
        );
      } catch (error) {
        console.error("Loading Error:", error);

        setProducts(
          removeDeletedProducts(getLocalProducts())
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // ================= IMAGE UPLOAD =================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500000) {
      alert("Please select an image below 500KB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previousData) => ({
        ...previousData,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= CLEAR FORM =================

  const clearForm = () => {
    setFormData({
      name: "",
      variant: "",
      price: "",
      category: "Grocery",
      unit: "kg",
      image: "",
      stock: "",
    });

    setEditingId(null);
  };

  // ================= ADD OR UPDATE PRODUCT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      Number(formData.price) <= 0 ||
      Number(formData.stock) < 0 ||
      !Number.isFinite(Number(formData.price)) ||
      !Number.isFinite(Number(formData.stock))
    ) {
      alert("Enter valid price and stock");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      variant: formData.variant.trim() || "Standard",
      price: Number(formData.price),
      category: formData.category,
      unit: formData.unit,
      image: formData.image,
      stock: Number(formData.stock),
    };

    try {
      setLoading(true);

      let response;

      if (editingId) {
        response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      }

      const result = await response.json();

      console.log("SAVE RESPONSE:", result);

      if (!response.ok || !result.product) {
        throw new Error(
          result.message || "Product save failed"
        );
      }

      const savedProduct = normalizeProduct(
        result.product
      );

      let updatedProducts;

      if (editingId) {
        updatedProducts = products.map((product) => {
          const productId = product._id || product.id;

          return String(productId) === String(editingId)
            ? savedProduct
            : product;
        });
      } else {
        updatedProducts = [...products, savedProduct];
      }

      const finalProducts = removeDuplicates(
        updatedProducts
      );

      setProducts(finalProducts);

      localStorage.setItem(
        "adminProducts",
        JSON.stringify(finalProducts)
      );

      removeDeletedProductId(savedProduct.id);

      alert(
        editingId
          ? "Product updated successfully! ✅"
          : "Product added successfully! ✅"
      );

      clearForm();
    } catch (error) {
      console.error("Save Error:", error);

      alert(
        error.message ||
          "Product save failed. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT PRODUCT =================

  const editProduct = (product) => {
    const productId = product._id || product.id;

    setFormData({
      name: product.name || "",
      variant: product.variant || "",
      price: product.price || "",
      category: product.category || "Grocery",
      unit: product.unit || "kg",
      image: product.image || "",
      stock: product.stock ?? "",
    });

    setEditingId(productId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE PRODUCT =================

  const deleteProduct = async (id) => {
    const product = products.find((item) => {
      const productId = item._id || item.id;

      return String(productId) === String(id);
    });

    if (!product) {
      alert("Product not found");
      return;
    }

    const productName =
      product.variant &&
      product.variant.toLowerCase() !== "standard"
        ? `${product.name} - ${product.variant}`
        : product.name;

    const confirmDelete = window.confirm(
      `Delete "${productName}"?`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      // MongoDB product only
      if (product._id) {
        console.log(
          "DELETING MONGODB PRODUCT:",
          product._id
        );

        const response = await fetch(
          `${API_URL}/${product._id}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        console.log("DELETE RESPONSE:", result);

        if (!response.ok) {
          throw new Error(
            result.message || "Delete failed"
          );
        }
      } else {
        console.log(
          "DELETING LOCAL PRODUCT:",
          product.id
        );
      }

      const updatedProducts = products.filter((item) => {
        const productId = item._id || item.id;

        return String(productId) !== String(id);
      });

      setProducts(updatedProducts);

      localStorage.setItem(
        "adminProducts",
        JSON.stringify(updatedProducts)
      );

      saveDeletedProductId(id);

      if (String(editingId) === String(id)) {
        clearForm();
      }

      alert("Product deleted successfully! 🗑️");
    } catch (error) {
      console.error("Delete Error:", error);

      alert(
        error.message || "Product delete failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="admin-products">
      <h2>🛒 Manage Products</h2>

      <form
        onSubmit={handleSubmit}
        className="product-form"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Variant (optional)"
          value={formData.variant}
          onChange={(e) =>
            setFormData({
              ...formData,
              variant: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        >
          <option value="Grocery">Grocery</option>
          <option value="Dairy">Dairy</option>
          <option value="Bakery">Bakery</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Snacks">Snacks</option>
        </select>

        <select
          value={formData.unit}
          onChange={(e) =>
            setFormData({
              ...formData,
              unit: e.target.value,
            })
          }
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="litre">litre</option>
          <option value="packet">packet</option>
          <option value="piece">piece</option>
          <option value="dozen">dozen</option>
        </select>

        <input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock: e.target.value,
            })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="image-preview"
          />
        )}

        <button type="submit" disabled={loading}>
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>📦 Product List</h3>

      {loading && <p>Loading products...</p>}

      {!loading && products.length === 0 ? (
        <p>No Products Added</p>
      ) : (
        <div className="product-list">
          {products.map((product) => {
            const productId = product._id || product.id;

            return (
              <div
                className="product-item"
                key={productId}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                )}

                <div>
                  <h4>
                    {product.name}

                    {product.variant &&
                      product.variant.toLowerCase() !==
                        "standard" &&
                      ` - ${product.variant}`}
                  </h4>

                  <p>₹{product.price}</p>

                  <p>
                    Category: {product.category}
                  </p>

                  <p>
                    Stock: {product.stock}{" "}
                    {product.unit || ""}
                  </p>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(productId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;