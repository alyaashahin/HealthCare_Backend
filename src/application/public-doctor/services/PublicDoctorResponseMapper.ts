import type { PublicDoctorRecord } from "../../../domain/repositories/IPublicDoctorRepository";
import type { PublicDoctorResponseDto } from "../dtos/PublicDoctorResponseDto";

export class PublicDoctorResponseMapper {
  static toDto(doctor: PublicDoctorRecord): PublicDoctorResponseDto {
    return {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      bio: doctor.bio,
      imageUrl: doctor.imageUrl,
      experienceYears: doctor.experienceYears
    };
  }

  static toDtoList(
    doctors: PublicDoctorRecord[]
  ): PublicDoctorResponseDto[] {
    return doctors.map((doctor) => this.toDto(doctor));
  }
}
