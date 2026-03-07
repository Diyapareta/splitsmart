import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  // console.log("Header:", req.headers.authorization);
  // console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("Token:", token);

    try {
      // console.log("JWT Secret:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
  //      console.log("JWT ERROR:", error.message);
  // return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "No token provided" });
 

};



