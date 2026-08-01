import type { AddDoctorScheduleDto } from "../dtos/AddDoctorScheduleDto";
import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";

import type {
  DoctorScheduleRecord,
  IDoctorScheduleRepository
} from "../../../domain/repositories/IDoctorScheduleRepository";

import { DoctorScheduleRules } from "../validators/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../validators/DoctorScheduleValidator";

import { formatTime } from "../../../shared/utils/dateTime";

export class AddDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly rules: DoctorScheduleRules
  ) {}

  async execute(
    input: AddDoctorScheduleDto,
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto> {
    const doctorId = actor.userId;

    await this.rules.ensureDoctorExists(doctorId);

    const schedule = this.validator.validateSchedule(input);

    await this.rules.ensureNoDuplicateOrOverlap({
      doctorId,
      ...schedule
    });

    const createdSchedule = await this.repository.create({
      doctorId,
      ...schedule
    });

    return this.toResponse(createdSchedule);
  }

  private toResponse(
    schedule: DoctorScheduleRecord
  ): DoctorScheduleResponseDto {
    return {
      id: schedule.id,
      doctorId: schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: formatTime(schedule.startTime),
      endTime: formatTime(schedule.endTime),
      durationInMinutes: schedule.durationInMinutes,
      createdAt: schedule.createdAt
    };
  }
}