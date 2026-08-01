import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";
import { BookingResponseMapper } from "../services/BookingResponseMapper";

export class CancelBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(
    actor: AuthenticatedActorDto,
    bookingIdInput: string
  ): Promise<BookingResponseDto> {
    const bookingId = this.validator.validateId(bookingIdInput, "Booking ID");
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found", "BOOKING_NOT_FOUND");
    }

    if (actor.role !== "PATIENT" || actor.userId !== booking.patientId) {
      throw new ForbiddenError(
        "Patients can only cancel their own bookings",
        "BOOKING_CANCEL_ACCESS_DENIED"
      );
    }

    if (booking.status !== "BOOKED") {
      throw new ConflictError(
        "Only a BOOKED appointment can be cancelled",
        "BOOKING_CANNOT_BE_CANCELLED"
      );
    }

    const cancelledBooking = await this.bookingRepository.cancelById(bookingId);
    return BookingResponseMapper.toDto(cancelledBooking);
  }
}
