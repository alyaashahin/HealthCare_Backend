import type { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../../domain/errors/ForbiddenError";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";

export const requireProfileOwnerOrAdmin = (
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

  if (request.auth.role === "ADMIN") {
    next();
    return;
  }

  const requestedUserId = request.params.userId;

  if (
    request.auth.role === "DOCTOR" &&
    request.auth.sub === requestedUserId
  ) {
    next();
    return;
  }

  next(
    new ForbiddenError(
      "You can only access your own doctor profile",
      "DOCTOR_PROFILE_ACCESS_DENIED"
    )
  );
};

export const requireCreateProfileOwnerOrAdmin = (
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

  if (request.auth.role === "ADMIN") {
    next();
    return;
  }

  const body = request.body as { userId?: unknown };
  const requestedUserId = body.userId;

  if (
    request.auth.role === "DOCTOR" &&
    typeof requestedUserId === "string" &&
    request.auth.sub === requestedUserId
  ) {
    next();
    return;
  }

  next(
    new ForbiddenError(
      "You can only create your own doctor profile",
      "DOCTOR_PROFILE_CREATE_DENIED"
    )
  );
};
