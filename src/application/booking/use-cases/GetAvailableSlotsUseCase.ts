import type { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { formatTime } from "../../../shared/utils/dateTime";
import type { AvailableSlotDto } from "../dtos/AvailableSlotDto";
import { BookingInputValidator } from "../services/BookingInputValidator";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
] as const;

export class GetAvailableSlotsUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly validator: BookingInputValidator
  ) {}

  async execute(
    doctorIdInput: string,
    dateQuery: unknown
  ): Promise<AvailableSlotDto[]> {
    const doctorId = this.validator.validateId(doctorIdInput, "Doctor ID");
    const bookingDate = this.validator.validateDateQuery(dateQuery);
    const doctor = await this.bookingRepository.findUserById(doctorId);

    if (!doctor) {
      throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
    }

    if (doctor.role !== "DOCTOR") {
      throw new ValidationError(
        "Selected user does not have DOCTOR role",
        "USER_IS_NOT_DOCTOR"
      );
    }

    const schedules = await this.bookingRepository.findDoctorSchedules(
      doctorId,
      DAYS[bookingDate.getUTCDay()]
    );

    if (schedules.length === 0) {
      return [];
    }

    const bookings = await this.bookingRepository.findDoctorBookingsByDate(
      doctorId,
      bookingDate
    );

    const availableSlots: AvailableSlotDto[] = [];

    for (const schedule of schedules) {
      let slotStartMinutes = this.toMinutes(schedule.startTime);
      const scheduleEndMinutes = this.toMinutes(schedule.endTime);

      while (
        slotStartMinutes + schedule.durationInMinutes <= scheduleEndMinutes
      ) {
        const slotEndMinutes = slotStartMinutes + schedule.durationInMinutes;
        const slotStart = this.fromMinutes(slotStartMinutes);
        const slotEnd = this.fromMinutes(slotEndMinutes);

        const isBooked = bookings.some(
          (booking) =>
            slotStart < booking.endTime && slotEnd > booking.startTime
        );

        if (!isBooked) {
          availableSlots.push({
            startTime: formatTime(slotStart),
            endTime: formatTime(slotEnd)
          });
        }

        slotStartMinutes = slotEndMinutes;
      }
    }

    return availableSlots;
  }

  private toMinutes(value: Date): number {
    return value.getUTCHours() * 60 + value.getUTCMinutes();
  }

  private fromMinutes(totalMinutes: number): Date {
    const date = new Date("1970-01-01T00:00:00.000Z");
    date.setUTCMinutes(totalMinutes);
    return date;
  }
}
