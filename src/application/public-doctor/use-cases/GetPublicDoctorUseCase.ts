import type { IPublicDoctorRepository } from "../../../domain/repositories/IPublicDoctorRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { PublicDoctorResponseDto } from "../dtos/PublicDoctorResponseDto";
import { PublicDoctorResponseMapper } from "../services/PublicDoctorResponseMapper";

export class GetPublicDoctorUseCase {
  constructor(
    private readonly repository: IPublicDoctorRepository
  ) {}

  async execute(doctorIdInput: string): Promise<PublicDoctorResponseDto> {
    const doctorId = doctorIdInput?.trim();

    if (!doctorId) {
      throw new ValidationError(
        "Doctor ID is required",
        "DOCTOR_ID_REQUIRED"
      );
    }

    const doctor = await this.repository.findById(doctorId);

    if (!doctor) {
      throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
    }

    return PublicDoctorResponseMapper.toDto(doctor);
  }
}
