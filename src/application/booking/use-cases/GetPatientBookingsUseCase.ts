import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";

export class GetPatientBookingsUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(patientIdInput: string): Promise<BookingResponseDto[]> {
    const patientId = this.validator.validateId(patientIdInput, "Patient ID");
    const patient = await this.bookingRepository.findUserById(patientId);

    if (!patient) throw new NotFoundError("Patient not found", "PATIENT_NOT_FOUND");
    if (patient.role !== "PATIENT") {
      throw new ValidationError("User does not have PATIENT role", "USER_IS_NOT_PATIENT");
    }

    return this.bookingRepository.findByPatientId(patientId);
  }
}
