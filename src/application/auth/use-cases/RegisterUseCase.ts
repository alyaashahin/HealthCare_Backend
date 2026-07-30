import { randomUUID } from "node:crypto";
import type {
  IUserRepository,
  UserRecord
} from "../../../domain/repositories/IUserRepository";
import type { IHashService } from "../../../domain/services/IHashService";
import type { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../../domain/errors/AppError";
import type {
  RegisterDto,
  RegisterResponseDto
} from "../dtos/RegisterDto";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: RegisterDto): Promise<RegisterResponseDto> {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    this.validateInput(name, email, password);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email is already registered", 409, "EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await this.hashService.hash(password);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      role: "PATIENT"
    });

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: this.toSafeUser(user),
      token
    };
  }

  private validateInput(
    name: string | undefined,
    email: string | undefined,
    password: string | undefined
  ): asserts name is string {
    if (!name || name.length < 2 || name.length > 150) {
      throw new AppError(
        "Name must contain between 2 and 150 characters",
        400,
        "INVALID_NAME"
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 255 || !emailPattern.test(email)) {
      throw new AppError("A valid email is required", 400, "INVALID_EMAIL");
    }

    if (!password || password.length < 8 || password.length > 72) {
      throw new AppError(
        "Password must contain between 8 and 72 characters",
        400,
        "INVALID_PASSWORD"
      );
    }
  }

  private toSafeUser(user: UserRecord): RegisterResponseDto["user"] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
