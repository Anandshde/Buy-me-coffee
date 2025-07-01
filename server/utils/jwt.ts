import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in .env");
}

export const createToken = (payload: object) => {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );
};
