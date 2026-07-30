import type { DayOfWeek } from "@prisma/client";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { CreateBookingDto } from "../dtos/CreateBookingDto";

export interface ValidatedBookingInput {
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  dayOfWeek: DayOfWeek;
}

const DAYS: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];

export class BookingInputValidator {
  validateCreateInput(input: CreateBookingDto): ValidatedBookingInput {
    const patientId = input.patientId?.trim();
    const doctorId = input.doctorId?.trim();

    if (!patientId) {
      throw new ValidationError("Patient ID is required", "PATIENT_ID_REQUIRED");
    }

    if (!doctorId) {
      throw new ValidationError("Doctor ID is required", "DOCTOR_ID_REQUIRED");
    }

    const bookingDate = this.parseDate(input.bookingDate);
    const startTime = this.parseTime(input.startTime, "startTime");
    const endTime = this.parseTime(input.endTime, "endTime");

    if (startTime >= endTime) {
      throw new ValidationError(
        "Start time must be before end time",
        "INVALID_BOOKING_TIME"
      );
    }

    const appointmentDateTime = new Date(bookingDate);
    appointmentDateTime.setUTCHours(
      startTime.getUTCHours(),
      startTime.getUTCMinutes(),
      startTime.getUTCSeconds(),
      0
    );

    if (appointmentDateTime <= new Date()) {
      throw new ValidationError(
        "Booking cannot be in the past",
        "BOOKING_IN_THE_PAST"
      );
    }

    return {
      patientId,
      doctorId,
      bookingDate,
      startTime,
      endTime,
      dayOfWeek: DAYS[bookingDate.getUTCDay()]
    };
  }

  validateId(id: string, fieldName: string): string {
    const value = id?.trim();

    if (!value) {
      throw new ValidationError(`${fieldName} is required`, "ID_REQUIRED");
    }

    return value;
  }

  private parseDate(value: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
      throw new ValidationError(
        "bookingDate must use YYYY-MM-DD format",
        "INVALID_BOOKING_DATE"
      );
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new ValidationError("Invalid booking date", "INVALID_BOOKING_DATE");
    }

    return date;
  }

  private parseTime(value: string, fieldName: string): Date {
    if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value ?? "")) {
      throw new ValidationError(
        `${fieldName} must use HH:mm or HH:mm:ss format`,
        "INVALID_TIME_FORMAT"
      );
    }

    const normalizedTime = value.length === 5 ? `${value}:00` : value;
    return new Date(`1970-01-01T${normalizedTime}.000Z`);
  }
}
