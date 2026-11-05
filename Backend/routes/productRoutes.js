const express = require("express");
const router = express.Router();

const Product = require("../models/productModel");

// ================= GET ALL PRODUCTS =================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// ================= GET SINGLE PRODUCT =================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET SINGLE PRODUCT ERROR:", error);

    res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message,
    });
  }
});

// ================= ADD PRODUCT TO MONGODB =================

router.post("/", async (req, res) => {
  try {
    console.log("POST PRODUCT REQUEST:", req.body);

    const {
      name,
      variant,
      price,
      category,
      unit,
      image,
      stock,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    if (
      String(name).trim() === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Number.isFinite(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product details",
      });
    }

    const newProduct = new Product({
      name: String(name).trim(),
      variant: variant
        ? String(variant).trim()
        : "Standard",
      price: Number(price),
      category: category || "Grocery",
      unit: unit || "piece",
      image: image || "",
      stock: Number(stock),
    });

    const savedProduct = await newProduct.save();

    console.log(
      "PRODUCT SAVED IN MONGODB:",
      savedProduct
    );

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// ================= UPDATE PRODUCT =================

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      variant,
      price,
      category,
      unit,
      image,
      stock,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: String(name).trim(),
        variant: variant
          ? String(variant).trim()
          : "Standard",
        price: Number(price),
        category: category || "Grocery",
        unit: unit || "piece",
        image: image || "",
        stock: Number(stock),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// ================= DELETE PRODUCT =================

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// ================= UPDATE STOCK =================

router.patch("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;

    if (
      stock === undefined ||
      !Number.isFinite(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid stock is required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stock: Number(stock),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("STOCK UPDATE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
});

module.exports = router;