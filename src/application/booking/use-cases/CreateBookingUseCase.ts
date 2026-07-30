import type { DoctorSchedule } from "@prisma/client";
import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import type { CreateBookingDto } from "../dtos/CreateBookingDto";
import {
  BookingInputValidator,
  type ValidatedBookingInput
} from "../services/BookingInputValidator";

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(input: CreateBookingDto): Promise<BookingResponseDto> {
    const data = this.validator.validateCreateInput(input);

    await this.validateUsers(data.patientId, data.doctorId);

    const schedules = await this.bookingRepository.findDoctorSchedules(
      data.doctorId,
      data.dayOfWeek
    );

    if (schedules.length === 0) {
      throw new NotFoundError(
        "Doctor schedule does not exist for this day",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    const matchingSchedule = schedules.find((schedule) =>
      this.matchesSchedule(data, schedule)
    );

    if (!matchingSchedule) {
      throw new ValidationError(
        "Booking must be inside working hours and match the slot duration",
        "INVALID_BOOKING_SLOT"
      );
    }

    await this.preventDoubleBooking(data);

    return this.bookingRepository.create({
      patientId: data.patientId,
      doctorId: data.doctorId,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "BOOKED"
    });
  }

  private async validateUsers(
    patientId: string,
    doctorId: string
  ): Promise<void> {
    const [patient, doctor] = await Promise.all([
      this.bookingRepository.findUserById(patientId),
      this.bookingRepository.findUserById(doctorId)
    ]);

    if (!patient) {
      throw new NotFoundError("Patient not found", "PATIENT_NOT_FOUND");
    }

    if (!doctor) {
      throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
    }

    if (patient.role !== "PATIENT") {
      throw new ValidationError(
        "patientId must belong to a PATIENT user",
        "USER_IS_NOT_PATIENT"
      );
    }

    if (doctor.role !== "DOCTOR") {
      throw new ValidationError(
        "doctorId must belong to a DOCTOR user",
        "USER_IS_NOT_DOCTOR"
      );
    }
  }

  private matchesSchedule(
    booking: ValidatedBookingInput,
    schedule: DoctorSchedule
  ): boolean {
    const bookingStart = this.minutesFromMidnight(booking.startTime);
    const bookingEnd = this.minutesFromMidnight(booking.endTime);
    const scheduleStart = this.minutesFromMidnight(schedule.startTime);
    const scheduleEnd = this.minutesFromMidnight(schedule.endTime);
    const bookingDuration = bookingEnd - bookingStart;

    const isInsideWorkingHours =
      bookingStart >= scheduleStart && bookingEnd <= scheduleEnd;

    const startsAtValidSlotBoundary =
      (bookingStart - scheduleStart) % schedule.durationInMinutes === 0;

    const matchesDuration =
      bookingDuration === schedule.durationInMinutes;

    return (
      isInsideWorkingHours &&
      startsAtValidSlotBoundary &&
      matchesDuration
    );
  }

  private async preventDoubleBooking(
    data: ValidatedBookingInput
  ): Promise<void> {
    const [doctorConflict, patientConflict] = await Promise.all([
      this.bookingRepository.findDoctorConflictingBooking(
        data.doctorId,
        data.bookingDate,
        data.startTime,
        data.endTime
      ),
      this.bookingRepository.findPatientConflictingBooking(
        data.patientId,
        data.bookingDate,
        data.startTime,
        data.endTime
      )
    ]);

    if (doctorConflict) {
      throw new ConflictError(
        "Doctor already has a booking during this time",
        "DOCTOR_DOUBLE_BOOKING"
      );
    }

    if (patientConflict) {
      throw new ConflictError(
        "Patient already has a booking during this time",
        "PATIENT_DOUBLE_BOOKING"
      );
    }
  }

  private minutesFromMidnight(value: Date): number {
    return value.getUTCHours() * 60 + value.getUTCMinutes();
  }
}
