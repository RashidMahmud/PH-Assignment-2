import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendresponse";

import { authService } from "./auth.service";

const userSignup = async (req: Request, res: Response) => {
  const result = await authService.signUpIntoDB(req.body);
  sendResponse(res, 201, {
    message: "User registered successfully",
    data: result.rows[0],
  });
};
const userLogin = async (req: Request, res: Response) => {
  const result = await authService.loginIntoDB(req.body);

  sendResponse(res, 200, {
    message: "Login successful",
    data: {
      token: result.accessToken,
      user: result.userWithoutPassword,
    },
  });
};

export const authController = {
  userSignup,
  userLogin,
};