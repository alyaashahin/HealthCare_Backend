import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import type { UpdateDoctorProfileDto } from "../dtos/UpdateDoctorProfileDto";
import type {
  IDoctorProfileRepository,
  UpdateDoctorProfileData
} from "../../../domain/repositories/IDoctorProfileRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { DoctorProfileInputValidator } from "../services/DoctorProfileInputValidator";

export class UpdateDoctorProfileUseCase {
  constructor(
    private readonly doctorProfileRepository: IDoctorProfileRepository,
    private readonly validator: DoctorProfileInputValidator
  ) {}

  async execute(input: UpdateDoctorProfileDto): Promise<DoctorProfileResponseDto> {
    const userId = this.validator.validateUserId(input.userId);
    const existingProfile = await this.doctorProfileRepository.findByUserId(userId);

    if (!existingProfile) {
      throw new NotFoundError(
        "Doctor profile not found",
        "DOCTOR_PROFILE_NOT_FOUND"
      );
    }

    const updateData = this.buildUpdateData(input);
    if (Object.keys(updateData).length === 0) {
      throw new ValidationError(
        "At least one profile field must be provided",
        "EMPTY_PROFILE_UPDATE"
      );
    }

    return this.doctorProfileRepository.updateByUserId(userId, updateData);
  }

  private buildUpdateData(input: UpdateDoctorProfileDto): UpdateDoctorProfileData {
    const data: UpdateDoctorProfileData = {};

    if (input.specialization !== undefined) {
      data.specialization = this.validator.validateSpecialization(
        input.specialization
      );
    }

    if (input.bio !== undefined) {
      data.bio = this.validator.validateOptionalText(input.bio, "Bio") ?? null;
    }

    if (input.imageUrl !== undefined) {
      data.imageUrl = this.validator.validateImageUrl(input.imageUrl) ?? null;
    }

    if (input.phone !== undefined) {
      data.phone =
        this.validator.validateOptionalText(input.phone, "Phone", 30) ?? null;
    }

    if (input.experienceYears !== undefined) {
      data.experienceYears =
        this.validator.validateExperienceYears(input.experienceYears) ?? null;
    }

    return data;
  }
}
