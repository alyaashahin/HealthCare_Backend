import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import type { DoctorScheduleResponseDto } from "../dtos/DoctorScheduleResponseDto";
import type { IDoctorScheduleRepository } from "../../../domain/repositories/IDoctorScheduleRepository";
import { DoctorSchedulePolicy } from "../services/DoctorSchedulePolicy";
import { DoctorScheduleRules } from "../services/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../services/DoctorScheduleValidator";

export class GetDoctorSchedulesUseCase {
  constructor(
    private readonly repository: IDoctorScheduleRepository,
    private readonly validator: DoctorScheduleValidator,
    private readonly rules: DoctorScheduleRules,
    private readonly policy: DoctorSchedulePolicy
  ) {}

  async execute(
    doctorIdInput: string,
    actor: AuthenticatedActorDto
  ): Promise<DoctorScheduleResponseDto[]> {
    const doctorId = this.validator.validateId(doctorIdInput, "doctorId");
    this.policy.ensureCanViewDoctor(actor, doctorId);
    await this.rules.ensureDoctorExists(doctorId);
    return this.repository.findByDoctorId(doctorId);
  }
}
