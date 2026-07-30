import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";

export class CancelBookingUseCase {
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

    if (booking.status === "COMPLETED") {
      throw new ConflictError(
        "A completed booking cannot be cancelled",
        "COMPLETED_BOOKING_CANNOT_BE_CANCELLED"
      );
    }

    if (booking.status === "CANCELLED") {
      throw new ConflictError(
        "Booking is already cancelled",
        "BOOKING_ALREADY_CANCELLED"
      );
    }

    return this.bookingRepository.updateStatus(bookingId, "CANCELLED");
  }
}
