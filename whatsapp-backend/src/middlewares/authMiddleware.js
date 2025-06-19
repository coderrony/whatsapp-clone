import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

 async function authMiddleware (req, res, next) {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());

  const bearerToken = req.headers["authorization"]; // which come from client
  // console.log("authMiddleware in bearerToken ",bearerToken);
  
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    }
    console.log("authMiddleware in payload ",payload);
    
    req.user = payload;
    next();
  });
}
export default authMiddleware