import type {
  IUserRepository,
  UserRecord,
} from "../../../domain/repositories/IUserRepository";

import type { IHashService } from "../../../domain/services/IHashService";
import type { ITokenService } from "../../../domain/services/ITokenService";

import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";

import type {
  LoginDto,
  LoginResponseDto,
} from "../dtos/LoginDto";

import { LoginValidator } from "../validators/LoginValidator";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = LoginValidator.validate(input);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatches = await this.hashService.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid password");
    }

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.toSafeUser(user),
      token,
    };
  }

  private toSafeUser(
    user: UserRecord
  ): LoginResponseDto["user"] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}