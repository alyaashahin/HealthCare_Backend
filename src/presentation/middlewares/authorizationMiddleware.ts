import type { NextFunction, Request, Response } from "express";
import type { UserRoleValue } from "../../domain/repositories/IUserRepository";
import { ForbiddenError } from "../../domain/errors/ForbiddenError";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";

export const authorizeRoles = (...allowedRoles: UserRoleValue[]) => {
  return (
    request: Request,
    _response: Response,
    next: NextFunction
  ): void => {
    if (!request.auth) {
      next(
        new UnauthorizedError(
          "Authentication is required",
          "AUTHENTICATION_REQUIRED"
        )
      );
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(
        new ForbiddenError(
          "You do not have permission to perform this action",
          "INSUFFICIENT_PERMISSION"
        )
      );
      return;
    }

    next();
  };
};
