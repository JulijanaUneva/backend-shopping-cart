import express from "express";
import { getProducts, addProduct } from "../controllers/productsControllers.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authorize, getProducts).post(authorize, addProduct);

export default router;
