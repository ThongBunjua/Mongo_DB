import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; 

export function verifyJWT(req) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}