import type { CreateDoctorProfileDto } from "../dtos/CreateDoctorProfileDto";
import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import type { IDoctorProfileRepository } from "../../../domain/repositories/IDoctorProfileRepository";
import type { TokenPayload } from "../../../domain/services/ITokenService";

import { 
  ConflictError,
  NotFoundError,
   ValidationError
 } from "../../../domain/errors";

import { DoctorProfileInputValidator } from "../services/DoctorProfileInputValidator";

export class CreateDoctorProfileUseCase {
  constructor(
    private readonly doctorProfileRepository: IDoctorProfileRepository,
    private readonly validator: DoctorProfileInputValidator
  ) {}

  async execute(
    input: CreateDoctorProfileDto,
    currentUser: TokenPayload
  ): Promise<DoctorProfileResponseDto> {
    const userId =
      currentUser.role === "ADMIN"
        ? this.validator.validateUserId(input.userId)
        : currentUser.sub;

    const user = await this.doctorProfileRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    if (user.role !== "DOCTOR") {
      throw new ValidationError(
        "Only a user with the DOCTOR role can have a doctor profile",
        "USER_IS_NOT_DOCTOR"
      );
    }

    const existingProfile =
      await this.doctorProfileRepository.findByUserId(userId);

    if (existingProfile) {
      throw new ConflictError(
        "Doctor profile already exists",
        "DOCTOR_PROFILE_ALREADY_EXISTS"
      );
    }

    return this.doctorProfileRepository.create({
      userId,
      specialization: this.validator.validateSpecialization(
        input.specialization
      ),
      bio: this.validator.validateOptionalText(input.bio, "Bio") ?? null,
      imageUrl: this.validator.validateImageUrl(input.imageUrl) ?? null,
      phone:
        this.validator.validateOptionalText(input.phone, "Phone", 30) ??
        null,
      experienceYears:
        this.validator.validateExperienceYears(
          input.experienceYears
        ) ?? null,
    });
  }
}