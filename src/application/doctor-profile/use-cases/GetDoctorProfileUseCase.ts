import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import type { IDoctorProfileRepository } from "../../../domain/repositories/IDoctorProfileRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { DoctorProfileInputValidator } from "../services/DoctorProfileInputValidator";

export class GetDoctorProfileUseCase {
  constructor(
    private readonly doctorProfileRepository: IDoctorProfileRepository,
    private readonly validator: DoctorProfileInputValidator
  ) {}

  async execute(userIdInput: string): Promise<DoctorProfileResponseDto> {
    const userId = this.validator.validateUserId(userIdInput);
    const profile = await this.doctorProfileRepository.findByUserId(userId);

    if (!profile) {
      throw new NotFoundError(
        "Doctor profile not found",
        "DOCTOR_PROFILE_NOT_FOUND"
      );
    }

    return profile;
  }
}
