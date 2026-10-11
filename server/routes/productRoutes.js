import express from "express";
import Product from "../models/Product.js";
import requireAdmin from "../middleware/auth.js";

const router = express.Router();

const ALLOWED_AVAILABILITY = ["available", "out_of_stock", "coming_soon"];

function cleanProductInput(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const price = Number(body.price);
  const availability = body.availability;

    if (!name) return { error: "Product name is required" };
  if (name.length > 100) return { error: "Name is too long (max 100)" };
  if (description.length > 1000) {
    return { error: "Description is too long (max 1000)" };
  }
  if (
    image &&
    !image.startsWith("/images/") &&
    !image.startsWith("https://res.cloudinary.com/")
  ) {
    return { error: "Image must come from the upload button" };
  }
  if (!category) return { error: "Category is required" };
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a number, 0 or more" };
  }
  if (!ALLOWED_AVAILABILITY.includes(availability)) {
    return { error: "Availability is not valid" };
  }

  return {
    data: { name, description, category, image, price, availability },
  };
}

// GET /api/products  -> all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json(products);
  } catch (error) {
    console.error("LOAD PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: "Could not load products" });
  }
});

// GET /api/products/:id  -> one product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      productId: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("LOAD PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Could not load product" });
  }
});

// POST /api/products  -> add a product (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { data, error } = cleanProductInput(req.body);
    if (error) return res.status(400).json({ message: error });

    const last = await Product.findOne().sort({ productId: -1 });
    const nextId = last ? last.productId + 1 : 1;

    const product = await Product.create({ ...data, productId: nextId });
    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Could not add product" });
  }
});

// PUT /api/products/:id  -> edit a product (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { data, error } = cleanProductInput(req.body);
    if (error) return res.status(400).json({ message: error });

    const product = await Product.findOneAndUpdate(
      { productId: Number(req.params.id) },
      data,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("EDIT PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Could not save product" });
  }
});

// DELETE /api/products/:id  -> admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      productId: Number(req.params.id),
    });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Could not delete product" });
  }
});

export default router;