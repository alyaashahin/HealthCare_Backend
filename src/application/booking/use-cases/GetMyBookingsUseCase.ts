import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import type { PatientBookingResponseDto } from "../dtos/PatientBookingResponseDto";
import { BookingResponseMapper } from "../services/BookingResponseMapper";

export class GetMyBookingsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    actor: AuthenticatedActorDto
  ): Promise<PatientBookingResponseDto[]> {
    if (actor.role !== "PATIENT") {
      throw new UnauthorizedError(
        "Only patients can access patient bookings",
        "PATIENT_REQUIRED"
      );
    }

    const bookings = await this.bookingRepository.findByPatientId(
      actor.userId
    );

    return BookingResponseMapper.toPatientDtoList(bookings);
  }
}
