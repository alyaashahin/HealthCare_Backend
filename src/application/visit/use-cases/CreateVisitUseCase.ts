import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { CreateVisitDto } from "../dtos/CreateVisitDto";
import type { VisitResponseDto } from "../dtos/VisitResponseDto";
import { VisitInputValidator } from "../services/VisitInputValidator";

export class CreateVisitUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: VisitInputValidator
  ) {}

  async execute(input: CreateVisitDto): Promise<VisitResponseDto> {
    const bookingId = this.validator.validateId(input.bookingId, "Booking ID");
    const booking = await this.visitRepository.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found", "BOOKING_NOT_FOUND");
    }

    if (booking.status !== "COMPLETED") {
      throw new ValidationError(
        "Booking status must be COMPLETED before creating a visit",
        "BOOKING_NOT_COMPLETED"
      );
    }

    const existingVisit =
      await this.visitRepository.findVisitByBookingId(bookingId);

    if (existingVisit) {
      throw new ConflictError(
        "This booking already has a visit",
        "VISIT_ALREADY_EXISTS"
      );
    }

    return this.visitRepository.createVisit({
      bookingId,
      medicalNotes: this.validator.validateMedicalNotes(input.medicalNotes),
      diagnosis: this.validator.validateOptionalText(input.diagnosis) ?? null,
      completedAt:
        this.validator.validateOptionalDate(input.completedAt) ?? null
    });
  }
}
