import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../../domain/errors/AppError";
import { ApiResponse } from "../../shared/response/ApiResponse";

export const errorMiddleware = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): Response => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json(
      ApiResponse.error(error.message)
    );
  }

  console.error(error);

  return response.status(500).json(
    ApiResponse.error(
      "Internal Server Error"
    )
  );
};