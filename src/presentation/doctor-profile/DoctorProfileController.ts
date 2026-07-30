import type {
  NextFunction,
  Request,
  Response
} from "express";

import type { ParamsDictionary } from "express-serve-static-core";

import type { CreateDoctorProfileDto } from "../../application/doctor-profile/dtos/CreateDoctorProfileDto";
import type { UpdateDoctorProfileDto } from "../../application/doctor-profile/dtos/UpdateDoctorProfileDto";

import type { CreateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/CreateDoctorProfileUseCase";
import type { GetDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/GetDoctorProfileUseCase";
import type { UpdateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/UpdateDoctorProfileUseCase";

export interface DoctorProfileUserIdParams
  extends ParamsDictionary {
  userId: string;
}

export type UpdateDoctorProfileBody = Omit<
  UpdateDoctorProfileDto,
  "userId"
>;

export class DoctorProfileController {
  constructor(
    private readonly createDoctorProfileUseCase: CreateDoctorProfileUseCase,
    private readonly getDoctorProfileUseCase: GetDoctorProfileUseCase,
    private readonly updateDoctorProfileUseCase: UpdateDoctorProfileUseCase
  ) {}

  create = async (
    request: Request<
      ParamsDictionary,
      unknown,
      CreateDoctorProfileDto
    >,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result =
        await this.createDoctorProfileUseCase.execute(
          request.body
        );

      response.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getByUserId = async (
    request: Request<DoctorProfileUserIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result =
        await this.getDoctorProfileUseCase.execute(
          request.params.userId
        );

      response.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  updateByUserId = async (
    request: Request<
      DoctorProfileUserIdParams,
      unknown,
      UpdateDoctorProfileBody
    >,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result =
        await this.updateDoctorProfileUseCase.execute({
          userId: request.params.userId,
          ...request.body
        });

      response.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
