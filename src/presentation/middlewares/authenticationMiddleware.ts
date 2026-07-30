import type { NextFunction, Request, Response } from "express";
import type {
  ITokenService,
  TokenPayload
} from "../../domain/services/ITokenService";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export const createAuthenticationMiddleware = (
  tokenService: ITokenService
) => {
  return async (
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authorizationHeader = request.headers.authorization;

      if (!authorizationHeader) {
        throw new UnauthorizedError(
          "Authentication token is required",
          "TOKEN_REQUIRED"
        );
      }

      const [tokenType, token] = authorizationHeader.split(" ");

      if (tokenType !== "Bearer" || !token) {
        throw new UnauthorizedError(
          "Authorization header must use Bearer token",
          "INVALID_AUTHORIZATION_HEADER"
        );
      }

      request.auth = await tokenService.verify(token);
      next();
    } catch (error) {
      next(error);
    }
  };
};
