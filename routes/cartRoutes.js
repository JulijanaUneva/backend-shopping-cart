import express from "express";
import {
  addProductToCart,
  getUserCart,
  updateProductQuantity,
  deleteProductFromCart,
} from "../controllers/cartController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authorize, addProductToCart);
router.get("/", authorize, getUserCart);
router.patch("/:productId", authorize, updateProductQuantity);
router.delete("/:productId", authorize, deleteProductFromCart);

export default router;
