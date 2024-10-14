import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectToDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
