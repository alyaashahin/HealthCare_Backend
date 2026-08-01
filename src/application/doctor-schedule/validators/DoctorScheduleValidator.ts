import type { DayOfWeek } from "@prisma/client";
import { ValidationError } from "../../../domain/errors/ValidationError";

export interface ValidatedScheduleData {
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
}

const allowedDays: readonly DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY"
];

export class DoctorScheduleValidator {
  validateId(value: string, fieldName: string): string {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
      throw new ValidationError(
        `${fieldName} is required`,
        `${fieldName.toUpperCase()}_REQUIRED`
      );
    }
    return normalizedValue;
  }

  validateSchedule(data: {
    dayOfWeek: DayOfWeek;
    startTime: string | Date;
    endTime: string | Date;
    durationInMinutes: number;
  }): ValidatedScheduleData {
    if (!allowedDays.includes(data.dayOfWeek)) {
      throw new ValidationError("Invalid day of week", "INVALID_DAY_OF_WEEK");
    }

    const startTime = this.toDatabaseTime(data.startTime, "startTime");
    const endTime = this.toDatabaseTime(data.endTime, "endTime");

    if (startTime.getTime() >= endTime.getTime()) {
      throw new ValidationError(
        "startTime must be before endTime",
        "INVALID_SCHEDULE_TIME_RANGE"
      );
    }

    if (
      !Number.isInteger(data.durationInMinutes) ||
      data.durationInMinutes <= 0
    ) {
      throw new ValidationError(
        "durationInMinutes must be a positive whole number",
        "INVALID_SLOT_DURATION"
      );
    }

    const scheduleMinutes =
      (endTime.getTime() - startTime.getTime()) / 60_000;

    if (data.durationInMinutes > scheduleMinutes) {
      throw new ValidationError(
        "durationInMinutes cannot be longer than the schedule period",
        "DURATION_EXCEEDS_SCHEDULE"
      );
    }

    if (scheduleMinutes % data.durationInMinutes !== 0) {
      throw new ValidationError(
        "The schedule period must be evenly divisible by durationInMinutes",
        "DURATION_DOES_NOT_FIT_SCHEDULE"
      );
    }

    return {
      dayOfWeek: data.dayOfWeek,
      startTime,
      endTime,
      durationInMinutes: data.durationInMinutes
    };
  }

  private toDatabaseTime(value: string | Date, fieldName: string): Date {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new ValidationError(
          `${fieldName} is invalid`,
          `INVALID_${fieldName.toUpperCase()}`
        );
      }
      return value;
    }

    const normalizedValue = value?.trim();
    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    if (!normalizedValue || !timePattern.test(normalizedValue)) {
      throw new ValidationError(
        `${fieldName} must use HH:mm or HH:mm:ss format`,
        `INVALID_${fieldName.toUpperCase()}`
      );
    }

    const timeWithSeconds =
      normalizedValue.length === 5 ? `${normalizedValue}:00` : normalizedValue;
    const parsedTime = new Date(`1970-01-01T${timeWithSeconds}.000Z`);

    if (Number.isNaN(parsedTime.getTime())) {
      throw new ValidationError(
        `${fieldName} is invalid`,
        `INVALID_${fieldName.toUpperCase()}`
      );
    }

    return parsedTime;
  }
}
