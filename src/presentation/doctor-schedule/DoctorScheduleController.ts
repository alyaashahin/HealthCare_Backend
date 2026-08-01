import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { AddDoctorScheduleDto } from "../../application/doctor-schedule/dtos/AddDoctorScheduleDto";
import type { UpdateDoctorScheduleDto } from "../../application/doctor-schedule/dtos/UpdateDoctorScheduleDto";

import type { AddDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/AddDoctorScheduleUseCase";
import type { DeleteDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/DeleteDoctorScheduleUseCase";
import type { GetDoctorSchedulesUseCase } from "../../application/doctor-schedule/use-cases/GetDoctorSchedulesUseCase";
import type { UpdateDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/UpdateDoctorScheduleUseCase";

import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { ApiResponse } from "../../shared/response/ApiResponse";

export interface ScheduleIdParams extends ParamsDictionary {
  scheduleId: string;
}

export class DoctorScheduleController {
  constructor(
    private readonly addUseCase: AddDoctorScheduleUseCase,
    private readonly updateUseCase: UpdateDoctorScheduleUseCase,
    private readonly deleteUseCase: DeleteDoctorScheduleUseCase,
    private readonly getUseCase: GetDoctorSchedulesUseCase
  ) {}

  create = async (
    request: Request<ParamsDictionary, unknown, AddDoctorScheduleDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const result = await this.addUseCase.execute(
        request.body,
        actor
      );

      response.status(201).json(
        ApiResponse.success(
          result,
          "Doctor schedule created successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getMySchedules = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const result = await this.getUseCase.execute(actor);

      response.status(200).json(
        ApiResponse.success(
          result,
          "Doctor schedules retrieved successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (
    request: Request<
      ScheduleIdParams,
      unknown,
      UpdateDoctorScheduleDto
    >,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      const result = await this.updateUseCase.execute(
        request.params.scheduleId,
        request.body,
        actor
      );

      response.status(200).json(
        ApiResponse.success(
          result,
          "Doctor schedule updated successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    request: Request<ScheduleIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.getActor(request);

      await this.deleteUseCase.execute(
        request.params.scheduleId,
        actor
      );

      response.status(200).json(
        ApiResponse.success(
          null,
          "Doctor schedule deleted successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  private getActor(request: Request) {
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