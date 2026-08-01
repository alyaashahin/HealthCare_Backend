export interface PublicDoctorRecord {
  id: string;
  name: string;
  specialization: string;
  bio: string | null;
  imageUrl: string | null;
  experienceYears: number | null;
}

export interface IPublicDoctorRepository {
  findAll(searchName?: string): Promise<PublicDoctorRecord[]>;
  findById(doctorId: string): Promise<PublicDoctorRecord | null>;
}
