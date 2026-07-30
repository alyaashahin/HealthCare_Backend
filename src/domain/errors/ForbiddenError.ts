import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(
    message = "You do not have permission",
    code = "FORBIDDEN"
  ) {
    super(message, 403, code);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
