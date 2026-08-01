import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IDoctorProfileRepository } from "../../../domain/repositories/IDoctorProfileRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";
import { DoctorProfileResponseMapper } from "../services/DoctorProfileResponseMapper";

export class GetDoctorProfileUseCase {
  constructor(private readonly repository: IDoctorProfileRepository) {}

  async execute(
    actor: AuthenticatedActorDto
  ): Promise<DoctorProfileResponseDto> {
    if (actor.role !== "DOCTOR") {
      throw new ForbiddenError(
        "Only doctors can access doctor profiles",
        "DOCTOR_ROLE_REQUIRED"
      );
    }

    const profile = await this.repository.findByUserId(actor.userId);

    if (!profile) {
      throw new NotFoundError(
        "Doctor profile not found",
        "DOCTOR_PROFILE_NOT_FOUND"
      );
    }

    return DoctorProfileResponseMapper.toDto(profile);
  }
}
