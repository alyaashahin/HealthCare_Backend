import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import type { IHashService } from "../../../domain/services/IHashService";
import type { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../../domain/errors/AppError";
import type { LoginDto, LoginResponseDto } from "../dtos/LoginDto";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginDto): Promise<LoginResponseDto> {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        400,
        "MISSING_CREDENTIALS"
      );
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await this.hashService.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}
