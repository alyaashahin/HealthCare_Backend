import type {
  NextFunction,
  Request,
  Response
} from "express";
import type { GetPublicDoctorUseCase } from "../../application/public-doctor/use-cases/GetPublicDoctorUseCase";
import type { GetPublicDoctorsUseCase } from "../../application/public-doctor/use-cases/GetPublicDoctorsUseCase";
import { ApiResponse } from "../../shared/response/ApiResponse";
import type { DoctorIdParams } from "./publicDoctor.types";

export class PublicDoctorController {
  constructor(
    private readonly getDoctorsUseCase: GetPublicDoctorsUseCase,
    private readonly getDoctorUseCase: GetPublicDoctorUseCase
  ) {}

  getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const searchName = this.getQueryString(request.query.search);
      const doctors = await this.getDoctorsUseCase.execute(searchName);

      response.status(200).json(
        ApiResponse.success(doctors, "Doctors retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    request: Request<DoctorIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctor = await this.getDoctorUseCase.execute(
        request.params.doctorId
      );

      response.status(200).json(
        ApiResponse.success(doctor, "Doctor retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  private getQueryString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    return value.trim() || undefined;
  }
}
