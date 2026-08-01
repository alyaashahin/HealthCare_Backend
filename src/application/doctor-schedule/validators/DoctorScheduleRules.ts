import type { DayOfWeek } from "@prisma/client";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";

export class DoctorScheduleRules {
  constructor(
    private readonly repository: IDoctorScheduleRepository
  ) {}

  async ensureDoctorExists(doctorId: string): Promise<void> {
    const user = await this.repository.findUserById(doctorId);

    if (!user) {
      throw new NotFoundError("Doctor user not found", "DOCTOR_NOT_FOUND");
    }

    if (user.role !== "DOCTOR") {
      throw new ValidationError(
        "The selected user does not have the DOCTOR role",
        "USER_IS_NOT_DOCTOR"
      );
    }
  }

  async ensureNoDuplicateOrOverlap(data: {
    doctorId: string;
    dayOfWeek: DayOfWeek;
    startTime: Date;
    endTime: Date;
    excludeScheduleId?: string;
  }): Promise<void> {
    const duplicate = await this.repository.findExactDuplicate(
      data.doctorId,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.excludeScheduleId
    );

    if (duplicate) {
      throw new ConflictError(
        "An identical doctor schedule already exists",
        "DOCTOR_SCHEDULE_DUPLICATE"
      );
    }

    const overlapping = await this.repository.findOverlapping(
      data.doctorId,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.excludeScheduleId
    );

    if (overlapping) {
      throw new ConflictError(
        "The doctor schedule overlaps another schedule on the same day",
        "DOCTOR_SCHEDULE_OVERLAP"
      );
    }
  }
}
