import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    productId: 1,
    name: "Crochet laptop Cover",
    price: 799,
    category: "Accessories",
    image: "/images/27.png",
    description: "A soft handmade crochet laptop cover, perfect for daily use.",
    availability: "available",
  },
  {
    productId: 2,
    name: "Crochet Flower Bouquet",
    price: 999,
    category: "Flowers",
    image: "/images/15.png",
    description: "A beautiful handmade crochet flower bouquet that lasts forever.",
    availability: "available",
  },
  {
    productId: 3,
    name: "Crochet Handbag",
    price: 899,
    category: "Bags",
    image: "/images/7.png",
    description: "A stylish handmade crochet handbag suitable for everyday use.",
    availability: "available",
  },
  {
    productId: 4,
    name: "Crochet Pokie key-chain",
    price: 699,
    category: "Accessories",
    image: "/images/24.png",
    description: "A cute handmade crochet keychain made with soft yarn.",
    availability: "available",
  },
  {
    productId: 5,
    name: "Crochet Rose Bunquet",
    price: 499,
    category: "Flowers",
    image: "/images/10.png",
    description:
      "A handmade crochet rose bunquet that can be kept as a beautiful decoration or gift.",
    availability: "available",
  },
  {
    productId: 6,
    name: "Crochet Keychain",
    price: 249,
    category: "Accessories",
    image: "/images/4.png",
    description: "A cute handmade crochet keychain for bags, keys and gifting.",
    availability: "out_of_stock",
  },
  {
    productId: 7,
    name: "Crochet Thali cover",
    price: 799,
    category: "Accessories",
    image: "/images/13.png",
    description: "Soft handmade crochet Thali cover specially made for ocasions.",
    availability: "available",
  },
  {
    productId: 8,
    name: "Crochet home decor",
    price: 899,
    category: "Home Decor",
    image: "/images/9.png",
    description:
      "A beautiful handmade crochet cushion to add warmth to your home.",
    availability: "available",
  },
];

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Imported ${products.length} products`);
  } catch (error) {
    console.error("Import failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runSeed();