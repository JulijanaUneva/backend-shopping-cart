import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

export function verifyJwt(token) {
  if (!token) return;

  return jwt.verify(token, JWT_SECRET);
}

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true });

  console.log(chalk.bold(chalk.blue("Register successful")));

  res.status(201).json({ message: "User registered", token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Проверка дали корисникот постои , ovoj user ima so wie so id nummer
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Генерирање на JWT токен , so jwt go pretvoram mojot id , tokenot mi e ist so mojot id
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Враќање на токенот , go zacuvuvam tokenot vo moeto cookie ,
  //no moram da go pretvoram povtorno vo id broj, zatoa mi treba middleware, authorize,
  //vo auth fcion , koja go dekodira tokenot vo id nazad.
  //posle 10 fcii na primer sakam pak da go koristam i go zimam pak od req.user.
  //moze i so product da se raboti, ama vo praksa povrzuvame so user.

  res.cookie("jwt", token, { httpOnly: true });

  console.log(chalk.bold(chalk.blue("Login successful")));

  res.status(200).json({ message: "Login successful", token });
};
