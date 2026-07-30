import type { SignOptions } from "jsonwebtoken";
import { LoginUseCase } from "../../application/auth/use-cases/LoginUseCase";
import { RegisterUseCase } from "../../application/auth/use-cases/RegisterUseCase";
import { AuthController } from "../../presentation/auth/AuthController";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptHashService } from "../services/BcryptHashService";
import { JwtTokenService } from "../services/JwtTokenService";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

const tokenExpiresIn = (
  process.env.JWT_EXPIRES_IN ?? "1d"
) as SignOptions["expiresIn"];

const userRepository = new PrismaUserRepository();
const hashService = new BcryptHashService(saltRounds);

export const tokenService = new JwtTokenService(
  jwtSecret,
  tokenExpiresIn
);

const registerUseCase = new RegisterUseCase(
  userRepository,
  hashService,
  tokenService
);

const loginUseCase = new LoginUseCase(
  userRepository,
  hashService,
  tokenService
);

export const authController = new AuthController(
  registerUseCase,
  loginUseCase
);
