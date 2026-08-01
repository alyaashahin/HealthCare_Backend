import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";
import type { UpdateDoctorScheduleDto } from "../dtos/UpdateDoctorScheduleDto";
import type {
  DoctorScheduleRecord,
  IDoctorScheduleRepository
} from "../../../domain/repositories/IDoctorScheduleRepository";

import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";

import { DoctorScheduleRules } from "../validators/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../validators/DoctorScheduleValidator";

import { formatTime } from "../../../shared/utils/dateTime";

export class UpdateDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly rules: DoctorScheduleRules
  ) {}

  async execute(
    scheduleIdInput: string,
    input: UpdateDoctorScheduleDto,
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto> {

    const scheduleId =
      this.validator.validateId(scheduleIdInput, "scheduleId");

    const existing =
      await this.repository.findById(scheduleId);

    if (!existing) {
      throw new NotFoundError(
        "Doctor schedule not found",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    if (existing.doctorId !== actor.userId) {
      throw new ValidationError(
        "You can only update your own schedules",
        "SCHEDULE_ACCESS_DENIED"
      );
    }

    if (Object.values(input).every(value => value === undefined)) {
      throw new ValidationError(
        "At least one schedule field must be provided",
        "EMPTY_SCHEDULE_UPDATE"
      );
    }

    const schedule = this.validator.validateSchedule({
      dayOfWeek: input.dayOfWeek ?? existing.dayOfWeek,
      startTime: input.startTime ?? existing.startTime,
      endTime: input.endTime ?? existing.endTime,
      durationInMinutes:
        input.durationInMinutes ?? existing.durationInMinutes
    });

    await this.rules.ensureNoDuplicateOrOverlap({
      doctorId: existing.doctorId,
      ...schedule,
      excludeScheduleId: existing.id
    });

    const updatedSchedule =
      await this.repository.update(existing.id, schedule);

    return {
      id: updatedSchedule.id,
      doctorId: updatedSchedule.doctorId,
      dayOfWeek: updatedSchedule.dayOfWeek,
      startTime: formatTime(updatedSchedule.startTime),
      endTime: formatTime(updatedSchedule.endTime),
      durationInMinutes: updatedSchedule.durationInMinutes,
      createdAt: updatedSchedule.createdAt
    };
  }
}