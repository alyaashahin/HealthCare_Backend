import { ValidationError } from "../../../domain/errors/ValidationError";

export interface ValidatedBookingInput {
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
}

export class BookingInputValidator {
  validateCreateInput(input: {
    doctorId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
  }): ValidatedBookingInput {
    const doctorId = input.doctorId?.trim();

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

    const bookingDateTime = new Date(bookingDate);
    bookingDateTime.setUTCHours(
      startTime.getUTCHours(),
      startTime.getUTCMinutes(),
      0,
      0
    );

    if (bookingDateTime <= new Date()) {
      throw new ValidationError(
        "Booking cannot be in the past",
        "BOOKING_IN_THE_PAST"
      );
    }

    return { doctorId, bookingDate, startTime, endTime };
  }

  validateDateQuery(value: unknown): Date {
    if (typeof value !== "string") {
      throw new ValidationError(
        "Date query parameter is required",
        "DATE_QUERY_REQUIRED"
      );
    }

    return this.parseDate(value);
  }

  validateId(value: string, fieldName: string): string {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
      throw new ValidationError(`${fieldName} is required`, "ID_REQUIRED");
    }
    return normalizedValue;
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

    const [year, month, day] = value.split("-").map(Number);
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      throw new ValidationError("Invalid booking date", "INVALID_BOOKING_DATE");
    }

    return date;
  }

  private parseTime(value: string, fieldName: string): Date {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value ?? "")) {
      throw new ValidationError(
        `${fieldName} must use HH:mm format`,
        "INVALID_TIME_FORMAT"
      );
    }

    return new Date(`1970-01-01T${value}:00.000Z`);
  }
}
