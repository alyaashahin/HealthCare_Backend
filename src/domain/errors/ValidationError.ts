import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message: string, code = "VALIDATION_ERROR") {
    super(message, 400, code);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
