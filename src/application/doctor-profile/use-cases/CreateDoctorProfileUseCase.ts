import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IDoctorProfileRepository } from "../../../domain/repositories/IDoctorProfileRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { CreateDoctorProfileDto } from "../dtos/CreateDoctorProfileDto";
import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import { DoctorProfileInputValidator } from "../services/DoctorProfileInputValidator";
import { DoctorProfileResponseMapper } from "../services/DoctorProfileResponseMapper";

export class CreateDoctorProfileUseCase {
  constructor(
    private readonly repository: IDoctorProfileRepository,
    private readonly validator: DoctorProfileInputValidator
  ) {}

  async execute(
    actor: AuthenticatedActorDto,
    input: CreateDoctorProfileDto
  ): Promise<DoctorProfileResponseDto> {
    this.ensureDoctorActor(actor);

    const user = await this.repository.findUserById(actor.userId);

    if (!user) {
      throw new NotFoundError("Doctor user not found", "DOCTOR_NOT_FOUND");
    }

    if (user.role !== "DOCTOR") {
      throw new ValidationError(
        "Authenticated user does not have DOCTOR role",
        "USER_IS_NOT_DOCTOR"
      );
    }

    if (await this.repository.findByUserId(actor.userId)) {
      throw new ConflictError(
        "Doctor profile already exists",
        "DOCTOR_PROFILE_ALREADY_EXISTS"
      );
    }

    const profile = await this.repository.create({
      userId: actor.userId,
      specialization: this.validator.validateSpecialization(
        input.specialization
      ),
      bio: this.validator.validateBio(input.bio) ?? null,
      phone: this.validator.validatePhone(input.phone) ?? null,
      imageUrl: this.validator.validateImageUrl(input.imageUrl) ?? null,
      experienceYears:
        this.validator.validateExperienceYears(input.experienceYears) ?? null
    });

    return DoctorProfileResponseMapper.toDto(profile);
  }

  private ensureDoctorActor(actor: AuthenticatedActorDto): void {
    if (actor.role !== "DOCTOR") {
      throw new ForbiddenError(
        "Only doctors can create doctor profiles",
        "DOCTOR_ROLE_REQUIRED"
      );
    }
  }
}
