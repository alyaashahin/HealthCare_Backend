import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedActorDto } from "../../application/shared/dtos/AuthenticatedActorDto";
import type { CreateBookingDto } from "../../application/booking/dtos/CreateBookingDto";
import type { CancelBookingUseCase } from "../../application/booking/use-cases/CancelBookingUseCase";
import type { CreateBookingUseCase } from "../../application/booking/use-cases/CreateBookingUseCase";
import type { GetAvailableSlotsUseCase } from "../../application/booking/use-cases/GetAvailableSlotsUseCase";
import type { GetDoctorBookingsUseCase } from "../../application/booking/use-cases/GetDoctorBookingsUseCase";
import type { GetMyBookingsUseCase } from "../../application/booking/use-cases/GetMyBookingsUseCase";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { ApiResponse } from "../../shared/response/ApiResponse";
import type {
  AvailableSlotsQuery,
  BookingIdParams,
  DoctorIdParams
} from "./booking.types";

export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getMyBookingsUseCase: GetMyBookingsUseCase,
    private readonly getDoctorBookingsUseCase: GetDoctorBookingsUseCase,
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase
  ) {}

  create = async (
    request: Request<Record<string, never>, unknown, CreateBookingDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.extractActor(request);
      const result = await this.createBookingUseCase.execute(
        actor,
        request.body
      );
      response.status(201).json(
        ApiResponse.success(result, "Booking created successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.extractActor(request);
      const result = await this.getMyBookingsUseCase.execute(actor);
      response.status(200).json(
        ApiResponse.success(
          result,
          "Patient bookings retrieved successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getDoctorBookings = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.extractActor(request);
      const result = await this.getDoctorBookingsUseCase.execute(actor);
      response.status(200).json(
        ApiResponse.success(
          result,
          "Doctor bookings retrieved successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getAvailableSlots = async (
    request: Request<DoctorIdParams, unknown, unknown, AvailableSlotsQuery>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getAvailableSlotsUseCase.execute(
        request.params.doctorId,
        request.query.date
      );
      response.status(200).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  };

  cancel = async (
    request: Request<BookingIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const actor = this.extractActor(request);
      const result = await this.cancelBookingUseCase.execute(
        actor,
        request.params.id
      );
      response.status(200).json(
        ApiResponse.success(result, "Booking cancelled successfully")
      );
    } catch (error) {
      next(error);
    }
  };

  private extractActor(request: Request): AuthenticatedActorDto {
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
