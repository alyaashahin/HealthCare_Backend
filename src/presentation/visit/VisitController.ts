import type {
  NextFunction,
  Request,
  Response
} from "express";

import type { AuthenticatedActorDto } from "../../application/shared/dtos/AuthenticatedActorDto";
import type { FinanceVisitFiltersDto } from "../../application/finance/dtos/FinanceVisitFiltersDto";
import type { SearchFinanceVisitsUseCase } from "../../application/finance/use-cases/SearchFinanceVisitsUseCase";
import type {
  AddTreatmentDto,
  UpdateTreatmentDto
} from "../../application/treatment/dtos/TreatmentDto";
import type { AddTreatmentUseCase } from "../../application/treatment/use-cases/AddTreatmentUseCase";
import type { DeleteTreatmentUseCase } from "../../application/treatment/use-cases/DeleteTreatmentUseCase";
import type { GetTreatmentsUseCase } from "../../application/treatment/use-cases/GetTreatmentsUseCase";
import type { UpdateTreatmentUseCase } from "../../application/treatment/use-cases/UpdateTreatmentUseCase";
import type { StartVisitDto } from "../../application/visit/dtos/StartVisitDto";
import type { CompleteVisitUseCase } from "../../application/visit/use-cases/CompleteVisitUseCase";
import type { GetMyDoctorVisitsUseCase } from "../../application/visit/use-cases/GetMyDoctorVisitsUseCase";
import type { GetMyPatientVisitsUseCase } from "../../application/visit/use-cases/GetMyPatientVisitsUseCase";
import type { StartVisitUseCase } from "../../application/visit/use-cases/StartVisitUseCase";
import type { TokenPayload } from "../../domain/services/ITokenService";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { ApiResponse } from "../../shared/response/ApiResponse";
import type {
  BookingIdParams,
  EmptyParams,
  FinanceFilters,
  TreatmentIdParams,
  VisitIdParams
} from "./visit.types";

interface AuthenticatedRequest {
  auth?: TokenPayload;
}

export class VisitController {
  constructor(
    private readonly startUc: StartVisitUseCase,
    private readonly completeUc: CompleteVisitUseCase,
    private readonly doctorUc: GetMyDoctorVisitsUseCase,
    private readonly patientUc: GetMyPatientVisitsUseCase,
    private readonly financeUc: SearchFinanceVisitsUseCase,
    private readonly addUc: AddTreatmentUseCase,
    private readonly getTUc: GetTreatmentsUseCase,
    private readonly updateTUc: UpdateTreatmentUseCase,
    private readonly deleteTUc: DeleteTreatmentUseCase
  ) {}

  start = async (
    request: Request<BookingIdParams, unknown, StartVisitDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.startUc.execute(
        this.extractActor(request),
        request.params.bookingId,
        request.body
      );

      response.status(201).json(
        ApiResponse.success(result, "Visit started successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  complete = async (
    request: Request<VisitIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.completeUc.execute(
        this.extractActor(request),
        request.params.visitId
      );

      response.status(200).json(
        ApiResponse.success(result, "Visit completed successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  myDoctor = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.doctorUc.execute(
        this.extractActor(request)
      );

      response.status(200).json(
        ApiResponse.success(result, "Doctor visits retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  myPatient = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.patientUc.execute(
        this.extractActor(request)
      );

      response.status(200).json(
        ApiResponse.success(result, "Patient visits retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  finance = async (
    request: Request<EmptyParams, unknown, unknown, FinanceFilters>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters: FinanceVisitFiltersDto = {
        visitId: request.query.visitId,
        doctorName: request.query.doctorName,
        patientName: request.query.patientName
      };

      const result = await this.financeUc.execute(
        this.extractActor(request),
        filters
      );

      response.status(200).json(
        ApiResponse.success(result, "Finance visits retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  addTreatment = async (
    request: Request<VisitIdParams, unknown, AddTreatmentDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.addUc.execute(
        this.extractActor(request),
        request.params.visitId,
        request.body
      );

      response.status(201).json(
        ApiResponse.success(result, "Treatment added successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  getTreatments = async (
    request: Request<VisitIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getTUc.execute(
        this.extractActor(request),
        request.params.visitId
      );

      response.status(200).json(
        ApiResponse.success(result, "Treatments retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  updateTreatment = async (
    request: Request<TreatmentIdParams, unknown, UpdateTreatmentDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.updateTUc.execute(
        this.extractActor(request),
        request.params.id,
        request.body
      );

      response.status(200).json(
        ApiResponse.success(result, "Treatment updated successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  deleteTreatment = async (
    request: Request<TreatmentIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteTUc.execute(
        this.extractActor(request),
        request.params.id
      );

      response.status(200).json(
        ApiResponse.success(null, "Treatment deleted successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  private extractActor(request: AuthenticatedRequest): AuthenticatedActorDto {
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
