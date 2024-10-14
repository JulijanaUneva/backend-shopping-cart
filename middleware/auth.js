import { verifyJwt } from "../libs/jwt.js";
import dotenv from "dotenv";
dotenv.config();

//ovaa funkcija ima uloga samo da go zacuva user id
export const authorize = (req, res, next) => {
  // 1. Get the JWT token from the cookies
  const token = req.cookies.jwt; //go zimam nadvor od cookie box
  // console.log(token);

  // 2. If the token is not found, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token not found" });
  }

  // 3. Verify the JWT token using the verifyJwt function

  try {
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET) //gleich mit z. 19
    const decodedToken = verifyJwt(token); // ensure token verification, se zacuvuva vo req.user, ne kako do sega req.body
    console.log(decodedToken); // Token is valid
    req.user = decodedToken; // attach user to request object
  } catch (error) {
    console.log("Token verification failed:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized, verification fails" });
  }

  // 4. If verification succeeds, continue
  next(); // Continue to next middleware or route handler
};
// {
//     "email":"julijana3uneva@gmail.com",
//     "password": "mojpassword"
//   }

// {
//   "name": "LapTop",
//   "price": 100,
//   "description": "Product Description",
//   "category": "Category Name",
//   "_id": "6708c3cdf781ac535388939e",
//   "__v": 0
// }

//post
// {
//   "user": "userId123",
//ne mi treba, koristam sega authoriz
//   "product": [
//     {
//       "productId": "productId123",
//       "quantity": 2
//     }
//   ]
// }

//patch
//   "user": "user_id",
//nur quantity, user braucht nicht mehr
// {
//   "quantity": 4
// }

// {
//   "user": {
//     "id": "67064c92bf4744ed287c2877"
//   }
// }
