export interface UpdateDoctorProfileDto {
  userId: string;
  specialization?: string;
  bio?: string | null;
  imageUrl?: string | null;
  phone?: string | null;
  experienceYears?: number | null;
}
