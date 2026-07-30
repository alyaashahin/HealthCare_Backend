import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";

export class CompleteBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(bookingIdInput: string): Promise<BookingResponseDto> {
    const bookingId = this.validator.validateId(bookingIdInput, "Booking ID");
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found", "BOOKING_NOT_FOUND");
    }

    if (booking.status === "CANCELLED") {
      throw new ConflictError(
        "A cancelled booking cannot be completed",
        "CANCELLED_BOOKING_CANNOT_BE_COMPLETED"
      );
    }

    if (booking.status === "COMPLETED") {
      throw new ConflictError(
        "Booking is already completed",
        "BOOKING_ALREADY_COMPLETED"
      );
    }

    return this.bookingRepository.updateStatus(bookingId, "COMPLETED");
  }
}
