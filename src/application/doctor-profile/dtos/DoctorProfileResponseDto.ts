export interface DoctorProfileResponseDto {
  id: string;
  userId: string;
  specialization: string;
  bio: string | null;
  imageUrl: string | null;
  phone: string | null;
  experienceYears: number | null;
  createdAt: Date;
  updatedAt: Date;
}
