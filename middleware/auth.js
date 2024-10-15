import { verifyJwt } from "../controllers/authController.js";
import dotenv from "dotenv";
dotenv.config();

//ovaa funkcija ima uloga samo da go zacuva user id
export const authorize = (req, res, next) => {
  // get the JWT token from the cookies
  const token = req.cookies.jwt; //go zimam nadvor od cookie kutija
  // console.log(token);

  // if the token is not found, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token not found" });
  }

  // verify the JWT token using the verifyJwt function

  try {
    const decodedToken = verifyJwt(token); // ensure token verification,
    //se zacuvuva vo req.user, ne kako do sega req.body
    // console.log(decodedToken); // Token is valid
    req.user = decodedToken; // attach user to request object
  } catch (error) {
    console.log("Token verification failed:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized, verification fails" });
  }

  next();
};
