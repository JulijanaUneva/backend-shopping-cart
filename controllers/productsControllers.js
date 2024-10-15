import Product from "../models/Product.js";
import chalk from "chalk";

export const getProducts = async (req, res) => {
  const { page = 1, limit = 5, category } = req.query;
  const { id } = req.user;

  try {
    const query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(
      chalk.yellow(`${products.length} products retrieved successfully 🛍️`)
    );

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
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

    console.log(chalk.bold(chalk.cyan("Product added successfully 🛍️")));

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category } = req.body;

  try {
    //azuriranje proizvod bez validacija
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category },
      { new: true } // vraka azuriran proizvod
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(chalk.bold(chalk.magenta("Product updated successfully 🛍️")));

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const remainingProducts = await Product.find();
    // console.log("Remaining Products:", remainingProducts);
    console.log(chalk.bold(chalk.blue("Product deleted successfully")));

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
      totalRemaining: remainingProducts.length,
      remainingProducts,
    });
  } catch (error) {
    // console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};
