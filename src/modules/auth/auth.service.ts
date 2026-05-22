import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../../config";
import type { ILoginPayload, ISignUpPayload } from "./auth.interface";

const signUpIntoDB = async (payload: ISignUpPayload) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
         INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id, name, email, role, created_at, updated_at
        `,
    [name, email, hashPassword, role],
  );

  return result;
};

const loginIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(String(password), user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials and password dontchange");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = await jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: config.access_expires_in as NonNullable<
      SignOptions["expiresIn"]
    >,
  });
  const { password: _, ...userWithoutPassword } = user;
  return { accessToken, userWithoutPassword };
};
export const authService = {
  signUpIntoDB,
  loginIntoDB,
};
