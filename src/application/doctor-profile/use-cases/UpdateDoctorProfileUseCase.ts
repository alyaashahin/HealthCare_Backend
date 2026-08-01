import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type {
  IDoctorProfileRepository,
  UpdateDoctorProfileData
} from "../../../domain/repositories/IDoctorProfileRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import type { UpdateDoctorProfileDto } from "../dtos/UpdateDoctorProfileDto";
import { DoctorProfileInputValidator } from "../services/DoctorProfileInputValidator";
import { DoctorProfileResponseMapper } from "../services/DoctorProfileResponseMapper";

export class UpdateDoctorProfileUseCase {
  constructor(
    private readonly repository: IDoctorProfileRepository,
    private readonly validator: DoctorProfileInputValidator
  ) {}

  async execute(
    actor: AuthenticatedActorDto,
    input: UpdateDoctorProfileDto
  ): Promise<DoctorProfileResponseDto> {
    if (actor.role !== "DOCTOR") {
      throw new ForbiddenError(
        "Only doctors can update doctor profiles",
        "DOCTOR_ROLE_REQUIRED"
      );
    }

    if (!(await this.repository.findByUserId(actor.userId))) {
      throw new NotFoundError(
        "Doctor profile not found",
        "DOCTOR_PROFILE_NOT_FOUND"
      );
    }

    const data = this.buildUpdateData(input);

    if (Object.keys(data).length === 0) {
      throw new ValidationError(
        "At least one profile field must be provided",
        "EMPTY_PROFILE_UPDATE"
      );
    }

    const profile = await this.repository.updateByUserId(
      actor.userId,
      data
    );

    return DoctorProfileResponseMapper.toDto(profile);
  }

  private buildUpdateData(
    input: UpdateDoctorProfileDto
  ): UpdateDoctorProfileData {
    const data: UpdateDoctorProfileData = {};

    if (input.specialization !== undefined) {
      data.specialization = this.validator.validateSpecialization(
        input.specialization
      );
    }

    if (input.bio !== undefined) {
      data.bio = this.validator.validateBio(input.bio) ?? null;
    }

    if (input.phone !== undefined) {
      data.phone = this.validator.validatePhone(input.phone) ?? null;
    }

    if (input.imageUrl !== undefined) {
      data.imageUrl = this.validator.validateImageUrl(input.imageUrl) ?? null;
    }

    if (input.experienceYears !== undefined) {
      data.experienceYears =
        this.validator.validateExperienceYears(input.experienceYears) ?? null;
    }

    return data;
  }
}
