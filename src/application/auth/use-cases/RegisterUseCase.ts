import type {
  IUserRepository,
  UserRecord,
  UserRoleValue
} from "../../../domain/repositories/IUserRepository";

import type { IHashService } from "../../../domain/services/IHashService";
import type { ITokenService } from "../../../domain/services/ITokenService";

import { ConflictError } from "../../../domain/errors/ConflictError";

import {
  RegisterDto,
  RegisterResponseDto
} from "../dtos/RegisterDto";

import { RegisterValidator } from "../validators/RegisterValidator";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: RegisterDto): Promise<RegisterResponseDto> {

    const name = input.name;
    const email = input.email;
    const password = input.password;

    RegisterValidator.validate(
      name,
      email,
      password
    );

    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(
        "Email is already registered"
      );
    }

    const passwordHash =
      await this.hashService.hash(password);

    const user =
      await this.userRepository.create({
        name,
        email,
        passwordHash,
        role: "PATIENT" as UserRoleValue
      });

    const token =
      await this.tokenService.sign({
        sub: user.id,
        email: user.email,
        role: user.role
      });

    return {
      user: this.toSafeUser(user),
      token
    };
  }

  private toSafeUser(
    user: UserRecord
  ): RegisterResponseDto["user"] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
