import type { NextFunction, Request, Response } from "express";
import type { LoginDto } from "../../application/auth/dtos/LoginDto";
import type { RegisterDto } from "../../application/auth/dtos/RegisterDto";
import type { LoginUseCase } from "../../application/auth/use-cases/LoginUseCase";
import type { RegisterUseCase } from "../../application/auth/use-cases/RegisterUseCase";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  register = async (
    request: Request<unknown, unknown, RegisterDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(request.body);
      response.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    request: Request<unknown, unknown, LoginDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(request.body);
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
