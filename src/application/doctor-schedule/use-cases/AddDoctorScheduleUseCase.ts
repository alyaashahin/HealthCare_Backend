import type { AddDoctorScheduleDto } from "../dtos/AddDoctorScheduleDto";
import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";
import { DoctorSchedulePolicy } from "../services/DoctorSchedulePolicy";
import { DoctorScheduleRules } from "../services/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../services/DoctorScheduleValidator";

export class AddDoctorScheduleUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly rules: DoctorScheduleRules,
    private readonly policy: DoctorSchedulePolicy
  ) {}

  async execute(
    input: AddDoctorScheduleDto,
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto> {
    const doctorId = this.validator.validateId(input.doctorId, "doctorId");
    this.policy.ensureCanManageDoctor(actor, doctorId);
    await this.rules.ensureDoctorExists(doctorId);

    const schedule = this.validator.validateSchedule(input);

    await this.rules.ensureNoDuplicateOrOverlap({
      doctorId,
      ...schedule
    });

    return this.repository.create({
      doctorId,
      ...schedule
    });
  }
}
