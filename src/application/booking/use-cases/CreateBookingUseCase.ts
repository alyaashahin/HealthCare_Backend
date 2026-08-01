import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { 
  ConflictError,
  ValidationError,
  UnauthorizedError,
  NotFoundError
 } from "../../../domain/errors";
import type { CreateBookingDto } from "../dtos/CreateBookingDto";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import { BookingInputValidator } from "../services/BookingInputValidator";
import { BookingResponseMapper } from "../services/BookingResponseMapper";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
] as const;

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) { }

  async execute(
    actor: AuthenticatedActorDto,
    input: CreateBookingDto
  ): Promise<BookingResponseDto> {
    if (actor.role !== "PATIENT") {
      throw new UnauthorizedError(
        "Only patients can create bookings",
        "PATIENT_REQUIRED"
      );
    }

    const data = this.validator.validateCreateInput(input);

    const [patient, doctor] = await Promise.all([
      this.bookingRepository.findUserById(actor.userId),
      this.bookingRepository.findUserById(data.doctorId)
    ]);

    if (!patient) {
      throw new NotFoundError(
        "Patient not found",
        "PATIENT_NOT_FOUND"
      );
    }

    if (!doctor) {
      throw new NotFoundError(
        "Doctor not found",
        "DOCTOR_NOT_FOUND"
      );
    }

    if (patient.role !== "PATIENT") {
      throw new ValidationError(
        "Authenticated user must have PATIENT role",
        "USER_IS_NOT_PATIENT"
      );
    }

    if (doctor.role !== "DOCTOR") {
      throw new ValidationError(
        "Selected user must have DOCTOR role",
        "USER_IS_NOT_DOCTOR"
      );
    }

    const existingBooking =
      await this.bookingRepository.findPatientBookingsByDate(
        actor.userId,
        data.bookingDate
      );

    if (existingBooking.length > 0) {
      throw new ConflictError(
        "You already have a booking on this day",
        "PATIENT_ALREADY_BOOKED_TODAY"
      );
    }

    const schedules =
      await this.bookingRepository.findDoctorSchedules(
        data.doctorId,
        DAYS[data.bookingDate.getUTCDay()]
      );

    if (schedules.length === 0) {
      throw new NotFoundError(
        "Doctor schedule does not exist for this date",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    const matchingSchedule = schedules.find((schedule) => {
      const bookingStart = this.toMinutes(data.startTime);
      const bookingEnd = this.toMinutes(data.endTime);
      const scheduleStart = this.toMinutes(schedule.startTime);
      const scheduleEnd = this.toMinutes(schedule.endTime);

      return (
        bookingStart >= scheduleStart &&
        bookingEnd <= scheduleEnd &&
        (bookingStart - scheduleStart) %
        schedule.durationInMinutes ===
        0 &&
        bookingEnd - bookingStart ===
        schedule.durationInMinutes
      );
    });

    if (!matchingSchedule) {
      throw new ValidationError(
        "Booking must be inside working hours and match the slot duration",
        "INVALID_BOOKING_SLOT"
      );
    }

    const [doctorBookings, patientBookings] =
      await Promise.all([
        this.bookingRepository.findDoctorBookingsByDate(
          data.doctorId,
          data.bookingDate
        ),
        this.bookingRepository.findPatientBookingsByDate(
          actor.userId,
          data.bookingDate
        )
      ]);

    if (
      doctorBookings.some((booking) =>
        this.overlaps(
          data.startTime,
          data.endTime,
          booking.startTime,
          booking.endTime
        )
      )
    ) {
      throw new ConflictError(
        "Doctor already has a booking during this time",
        "DOCTOR_DOUBLE_BOOKING"
      );
    }

    if (
      patientBookings.some((booking) =>
        this.overlaps(
          data.startTime,
          data.endTime,
          booking.startTime,
          booking.endTime
        )
      )
    ) {
      throw new ConflictError(
        "Patient already has a booking during this time",
        "PATIENT_DOUBLE_BOOKING"
      );
    }

    const booking = await this.bookingRepository.create({
      patientId: actor.userId,
      doctorId: data.doctorId,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "BOOKED"
    });

    return BookingResponseMapper.toDto(booking);
  }

  private overlaps(
    newStart: Date,
    newEnd: Date,
    existingStart: Date,
    existingEnd: Date
  ): boolean {
    return (
      newStart < existingEnd &&
      newEnd > existingStart
    );
  }

  private toMinutes(value: Date): number {
    return (
      value.getUTCHours() * 60 +
      value.getUTCMinutes()
    );
  }
}