import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import config from "../config";
import type { Roles } from "../types";

export const auth = (...roles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Access denied. No token provided",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      const userData = await pool.query(`SELECT id, name, email, role FROM users WHERE email=$1`, [
        decoded.email,
      ]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User account not found.",
        });
      }
     
    
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message:
            "Unauthorized. You do not have permission to access this resource.",
        });
      }
      req.user = decoded; 
      next();
    } catch (error) {
      next(error);
    }
  };
};