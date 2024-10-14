import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  // const { page = 1, limit = 3 } = req.query;
  const { id } = req.user;
  console.log(id);
  try {
    const products = await Product.find();
    // .skip((page - 1) * limit)
    // .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, category } = req.body;

  if (!name || !price || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
