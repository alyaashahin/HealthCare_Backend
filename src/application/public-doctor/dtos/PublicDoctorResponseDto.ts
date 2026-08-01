export interface PublicDoctorResponseDto {
  id: string;
  name: string;
  specialization: string;
  bio: string | null;
  imageUrl: string | null;
  experienceYears: number | null;
}
