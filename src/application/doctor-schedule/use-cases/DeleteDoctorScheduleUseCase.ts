import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { DoctorSchedulePolicy } from "../services/DoctorSchedulePolicy";
import { DoctorScheduleValidator } from "../services/DoctorScheduleValidator";

export class DeleteDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly policy: DoctorSchedulePolicy
  ) {}

  async execute(
    scheduleIdInput: string,
    actor: AuthenticatedActorDto
  ): Promise<void> {
    const scheduleId = this.validator.validateId(scheduleIdInput, "scheduleId");
    const existing = await this.repository.findById(scheduleId);

    if (!existing) {
      throw new NotFoundError(
        "Doctor schedule not found",
        "DOCTOR_SCHEDULE_NOT_FOUND"
      );
    }

    this.policy.ensureCanManageDoctor(actor, existing.doctorId);
    await this.repository.delete(existing.id);
  }
}
