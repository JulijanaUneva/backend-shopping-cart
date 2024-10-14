import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsControllers.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authorize, getProducts).post(authorize, addProduct);
router
  .route("/:id")
  .put(authorize, updateProduct)
  .delete(authorize, deleteProduct);

export default router;
