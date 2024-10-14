// controllers/cartController.js
import Cart from "../models/Cart.js";
// import Product from "../models/Product.js"; // За да ги проверуваш продуктите

// Контролер за добивање на кошничката
export const getUserCart = async (req, res) => {
  // const { user } = req.body;
  const { id } = req.user;

  // console.log("user:", id); //proveruvam dali userot e prisuten
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  // const userId = req.user.id; // Преземање на userId од JWT
  // console.log("User ID:", userId);

  // Наместо да бараме во база, ќе го испратиме userId
  //   res.status(200).json({ message: "Success", userId });
  // };

  try {
    const cart = await Cart.findOne({ user: id }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Контролер за додавање на производ во кошничката
export const addProductToCart = async (req, res) => {
  const { product } = req.body;
  const { id } = req.user;
  //   const userId = req.user.id; // Преземање на userId од JWT
  //   console.log("addProductCart", userId);
  console.log("Request body", req.body);

  //   res.status(200).json({ message: "Product added", user, product });
  // };

  //   if (product[0].quantity <= 0 || !product[0].quantity) {
  //     return res.status(400).json({ message: "Valid quantity is required" });
  //   }
  //novo if
  if (!product || product[0].quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Valid product and quantity are required" });
  }

  try {
    // console.log("User ID:", user);
    console.log("Product ID:", product[0].productId);
    console.log("Quantity:", product[0].quantity);

    let cart = await Cart.findOne({ user: id });
    console.log("cart", cart);

    if (!cart) {
      // Ако кошничката не постои, ја креираме
      cart = new Cart({
        user: id,
        products: [
          { product: product[0].productId, quantity: product[0].quantity },
        ],
      });
    } else {
      // Ако кошничката постои, го додава производот или ја зголемува количината
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === product[0].productId
      ); //go bara produktot prvo vo kosnickata,proveruva dali proizvodot e najden vo kosnickata
      console.log(product[0].productId);

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += product[0].quantity;
        //ako postoi ja zgolemuvame kolicinata
      } else {
        cart.products.push({
          product: product[0].productId,
          quantity: product[0].quantity,
        });
        //ako ne postoi, go dodavame noviot proizvd
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Контролер за промена на количината на производот во кошничката
export const updateProductQuantity = async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;
  const { quantity } = req.body;
  // console.log("was ist user?", user);
  console.log("Request Body:", req.body);

  //   const userId = req.user.id;
  //   console.log("updateProductQuantity", userId);
  console.log("Request Body:", req.body);
  console.log("Quantity", quantity);
  console.log("Updated product", productId);
  //   res.status(200).json({ message: "Quantity updated", productId, quantity });

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  try {
    // const cart = await Cart.findOne({ user: user.id });
    const cart = await Cart.findOne({ user: id });

    if (!cart) {
      // console.log("Cart not found for user:", user.id);
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      cart.updatedAt = Date.now();

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

// Контролер за бришење на производ од кошничката
export const deleteProductFromCart = async (req, res) => {
  const { productId } = req.params;
  console.log("req.user:", req.user);
  const { id } = req.user; // ovoj id od sto se imame logirano(od token) preku fja autorize
  // const { user } = req.body;

  console.log("Product ID to delete:", productId);

  // if (!user || !user.id) {
  //   return res.status(400).json({ message: "User ID is required" });
  // }

  // Пример на излезот
  // res.status(200).json({ message: "Product deleted", productId });

  // const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: id });
    // const cart = await Cart.findOne({ "products[0].product": productId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json({ message: "Product deleted", cart });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
