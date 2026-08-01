import type {
  NextFunction,
  Request,
  Response
} from "express";

import type { AuthenticatedActorDto } from "../../application/shared/dtos/AuthenticatedActorDto";
import type { CreateDoctorProfileDto } from "../../application/doctor-profile/dtos/CreateDoctorProfileDto";
import type { UpdateDoctorProfileDto } from "../../application/doctor-profile/dtos/UpdateDoctorProfileDto";

import type { CreateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/CreateDoctorProfileUseCase";
import type { GetDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/GetDoctorProfileUseCase";
import type { UpdateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/UpdateDoctorProfileUseCase";

import type { TokenPayload } from "../../domain/services/ITokenService";

import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { ApiResponse } from "../../shared/response/ApiResponse";

interface AuthenticatedRequest {
  auth?: TokenPayload;
}

export class DoctorProfileController {
  constructor(
    private readonly createUseCase: CreateDoctorProfileUseCase,
    private readonly getUseCase: GetDoctorProfileUseCase,
    private readonly updateUseCase: UpdateDoctorProfileUseCase
  ) {}

  create = async (
    request: Request<
      Record<string, never>,
      unknown,
      CreateDoctorProfileDto
    >,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const dto = await this.createUseCase.execute(
        actor,
        request.body
      );

      response.status(201).json(
        ApiResponse.success(
          dto,
          "Doctor profile created successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getMe = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const dto = await this.getUseCase.execute(actor);

      response.status(200).json(
        ApiResponse.success(
          dto,
          "Doctor profile retrieved successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (
    request: Request<
      Record<string, never>,
      unknown,
      UpdateDoctorProfileDto
    >,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const dto = await this.updateUseCase.execute(
        actor,
        request.body
      );

      response.status(200).json(
        ApiResponse.success(
          dto,
          "Doctor profile updated successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  private getActor(
    request: AuthenticatedRequest
  ): AuthenticatedActorDto {
    if (!request.auth) {
      throw new UnauthorizedError(
        "Authentication is required",
        "AUTHENTICATION_REQUIRED"
      );
    }

    return {
      userId: request.auth.sub,
      role: request.auth.role
    };
  }
}
