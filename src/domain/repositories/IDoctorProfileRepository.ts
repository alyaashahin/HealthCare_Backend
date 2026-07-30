export type DoctorProfileUserRole =
  | "PATIENT"
  | "DOCTOR"
  | "FINANCE"
  | "ADMIN";

export interface DoctorProfileUserRecord {
  id: string;
  role: DoctorProfileUserRole;
}

export interface DoctorProfileRecord {
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

export interface CreateDoctorProfileData {
  userId: string;
  specialization: string;
  bio: string | null;
  imageUrl: string | null;
  phone: string | null;
  experienceYears: number | null;
}

export interface UpdateDoctorProfileData {
  specialization?: string;
  bio?: string | null;
  imageUrl?: string | null;
  phone?: string | null;
  experienceYears?: number | null;
}

export interface IDoctorProfileRepository {
  findUserById(userId: string): Promise<DoctorProfileUserRecord | null>;
  findByUserId(userId: string): Promise<DoctorProfileRecord | null>;
  create(data: CreateDoctorProfileData): Promise<DoctorProfileRecord>;
  updateByUserId(
    userId: string,
    data: UpdateDoctorProfileData
  ): Promise<DoctorProfileRecord>;
}
