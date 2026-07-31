import { ValidationError } from "../../../domain/errors/ValidationError";
import type { LoginDto } from "../dtos/LoginDto";

export class LoginValidator {
  static validate(input: LoginDto) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email) {
      throw new ValidationError("Email is required");
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    return {
      email,
      password,
    };
  }
}