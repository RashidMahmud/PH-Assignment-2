import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  status = 200,
  { message, data, error }: { message?: unknown; data?: T; error?: boolean },
) {
  res.status(status).json({
    success: error ? false : true,
    message: message,
    data: error ? undefined : data,
  });
}