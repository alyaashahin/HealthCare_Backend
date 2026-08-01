import type { DoctorProfileRecord } from "../../../domain/repositories/IDoctorProfileRepository";
import type { DoctorProfileResponseDto } from "../dtos/DoctorProfileResponseDto";

export class DoctorProfileResponseMapper {
  static toDto(profile: DoctorProfileRecord): DoctorProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      specialization: profile.specialization,
      bio: profile.bio,
      imageUrl: profile.imageUrl,
      phone: profile.phone,
      experienceYears: profile.experienceYears,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };
  }
}
