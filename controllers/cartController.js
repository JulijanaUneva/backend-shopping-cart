import Cart from "../models/Cart.js";
import chalk from "chalk";

export const getUserCart = async (req, res) => {
  const { id } = req.user;

  // console.log("user:", id);
  //proveruvam dali userot e prisuten
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const cart = await Cart.findOne({ user: id }).populate("products.product");
    // console.log("Retrieved cart:", cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log(chalk.bold(chalk.cyan("User's cart retrieved successfully: ")));

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { id } = req.user;

  // console.log("Request body", req.body);

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Valid product and quantity are required" });
  }

  try {
    let cart = await Cart.findOne({ user: id });
    // console.log("cart", cart);

    if (!cart) {
      // Ако кошничката не постои, ја креираме
      cart = new Cart({
        user: id,
        products: [{ product: productId, quantity: quantity }],
      });
    } else {
      // Ако кошничката постои, го додава производот или ја зголемува количината
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      ); //go bara produktot prvo vo kosnickata,proveruva dali proizvodot e najden vo kosnickata

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
        //ako postoi ja zgolemuvame kolicinata
      } else {
        cart.products.push({
          product: productId,

          quantity: quantity,
        });
        //ako ne postoi, go dodavame noviot proizvd
      }
    }

    console.log(
      chalk.bold(chalk.magenta("Product in cart added successfully"))
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Контролер за промена на количината на производот во кошничката
export const updateProductQuantity = async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  try {
    const cart = await Cart.findOne({ user: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      cart.updatedAt = Date.now();

      console.log(
        chalk.bold(chalk.blue("Product in cart updated successfully"))
      );

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  const { productId } = req.params;
  // console.log("req.user:", req.user);
  const { id } = req.user; // ovoj id od sto se imame logirano(od token) preku fja autorize

  try {
    const cart = await Cart.findOne({ user: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      const deletedProduct = cart.products[productIndex];
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json({
        message: "Product deleted",
        deletedProduct,
        remainingProducts: cart.products,
      });
      console.log(
        chalk.bold(chalk.cyan("Product in cart deleted successfully"))
      );
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
