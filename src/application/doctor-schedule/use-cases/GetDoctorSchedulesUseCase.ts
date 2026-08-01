import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";
import type {
  DoctorScheduleRecord,
  IDoctorScheduleRepository
} from "../../../domain/repositories/IDoctorScheduleRepository";

import { DoctorScheduleRules } from "../validators/DoctorScheduleRules";
import { formatTime } from "../../../shared/utils/dateTime";

export class GetDoctorSchedulesUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly rules: DoctorScheduleRules
  ) {}

  async execute(
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto[]> {

    await this.rules.ensureDoctorExists(actor.userId);

    const schedules =
      await this.repository.findByDoctorId(actor.userId);

    return schedules.map(schedule => this.toResponse(schedule));
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