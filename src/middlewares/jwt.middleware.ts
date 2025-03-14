import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import { verifyAccessToken } from "../utils/auth.util";

// Quiero extender o modificar el comportamiento de un módulo ya existente.
declare module "express-serve-static-core" {
    interface Request {
      email?: string;
      uid?: string;
      name?: string;
    }
  }
  
  export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Bearer token not found" });
      return;
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyAccessToken(token)
      req.email = payload.email;
      req.uid = payload.uid;
      req.name = payload.name;
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: "Token invalid signature" });
        return;
      }
  
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "Token expired" });
        return;
      }
  
      res.status(500).json("Token Error");
      return;
    }
  };
  