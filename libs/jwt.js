import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

// export function issueJwt(user) {
//   const payload = {
//     id: user._id,
//     //moze da bide i name: user.name, se biva , password itn
//   };
//   // gleiche wie in loginUser z. 51
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: "1h",
//   });
// }

export function verifyJwt(token) {
  if (!token) return;

  return jwt.verify(token, JWT_SECRET);
}
