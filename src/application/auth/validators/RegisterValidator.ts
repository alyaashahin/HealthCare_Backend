import { ValidationError } from "../../../domain/errors/ValidationError";

export class RegisterValidator {
  static validate(
    name: string | undefined,
    email: string | undefined,
    password: string | undefined
  ): void {
    if (!name) {
      throw new ValidationError("Name is required");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 150) {
      throw new ValidationError(
        "Name must be between 2 and 150 characters"
      );
    }

    const nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;

    if (!nameRegex.test(trimmedName)) {
      throw new ValidationError(
        "Name can contain only letters and spaces"
      );
    }

    if (!email) {
      throw new ValidationError("Email is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new ValidationError("Invalid email address");
    }

    if (normalizedEmail.length > 255) {
      throw new ValidationError("Email is too long");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,72}$/;

    if (!passwordRegex.test(password)) {
      throw new ValidationError(
        "Password must contain uppercase, lowercase, number and special character"
      );
    }
  }
}