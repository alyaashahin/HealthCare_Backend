import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";

export class GetDoctorBookingsUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(doctorIdInput: string): Promise<BookingResponseDto[]> {
    const doctorId = this.validator.validateId(doctorIdInput, "Doctor ID");
    const doctor = await this.bookingRepository.findUserById(doctorId);

    if (!doctor) throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
    if (doctor.role !== "DOCTOR") {
      throw new ValidationError("User does not have DOCTOR role", "USER_IS_NOT_DOCTOR");
    }

    return this.bookingRepository.findByDoctorId(doctorId);
  }
}
