import express from "express";
import {
  addProductToCart,
  getUserCart,
  updateProductQuantity,
  deleteProductFromCart,
} from "../controllers/cartController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authorize, getUserCart).post(authorize, addProductToCart);
router
  .route("/:productId")
  .patch(authorize, updateProductQuantity)
  .delete(authorize, deleteProductFromCart);

export default router;
