import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";
import type { UpdateDoctorScheduleDto } from "../dtos/UpdateDoctorScheduleDto";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { DoctorSchedulePolicy } from "../services/DoctorSchedulePolicy";
import { DoctorScheduleRules } from "../services/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../services/DoctorScheduleValidator";

export class UpdateDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly rules: DoctorScheduleRules,
    private readonly policy: DoctorSchedulePolicy
  ) {}

  async execute(
    scheduleIdInput: string,
    input: UpdateDoctorScheduleDto,
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto> {
    const scheduleId = this.validator.validateId(scheduleIdInput, "scheduleId");
    const existing = await this.repository.findById(scheduleId);

    if (!existing) {
      throw new NotFoundError(
        "Doctor schedule not found",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    this.policy.ensureCanManageDoctor(actor, existing.doctorId);

    if (Object.values(input).every((value) => value === undefined)) {
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

    return this.repository.update(existing.id, schedule);
  }
}
