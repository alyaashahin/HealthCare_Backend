import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";

import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";

import { DoctorScheduleValidator } from "../validators/DoctorScheduleValidator";

export class DeleteDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator
  ) {}

  async execute(
    scheduleIdInput: string,
    actor: AuthenticatedActorDto
  ): Promise<void> {

    const scheduleId =
      this.validator.validateId(
        scheduleIdInput,
        "scheduleId"
      );

    const existing =
      await this.repository.findById(scheduleId);

    if (!existing) {
      throw new NotFoundError(
        "Doctor schedule not found",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    if (existing.doctorId !== actor.userId) {
      throw new ForbiddenError(
        "You can only delete your own schedules",
        "SCHEDULE_ACCESS_DENIED"
      );
    }

    await this.repository.delete(existing.id);
  }
}