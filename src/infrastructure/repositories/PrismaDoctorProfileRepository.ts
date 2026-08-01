import type {
  DoctorProfile,
  User
} from "@prisma/client";
import type {
  CreateDoctorProfileData,
  DoctorProfileRecord,
  DoctorProfileUserRecord,
  IDoctorProfileRepository,
  UpdateDoctorProfileData
} from "../../domain/repositories/IDoctorProfileRepository";
import { prisma } from "../database/prisma";

export class PrismaDoctorProfileRepository
  implements IDoctorProfileRepository
{
  async findUserById(
    userId: string
  ): Promise<DoctorProfileUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    return user ? this.toUserRecord(user) : null;
  }

  async findByUserId(
    userId: string
  ): Promise<DoctorProfileRecord | null> {
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId }
    });

    return profile ? this.toProfileRecord(profile) : null;
  }

  async create(
    data: CreateDoctorProfileData
  ): Promise<DoctorProfileRecord> {
    const profile = await prisma.doctorProfile.create({ data });
    return this.toProfileRecord(profile);
  }

  async updateByUserId(
    userId: string,
    data: UpdateDoctorProfileData
  ): Promise<DoctorProfileRecord> {
    const profile = await prisma.doctorProfile.update({
      where: { userId },
      data
    });

    return this.toProfileRecord(profile);
  }

  private toUserRecord(
    user: Pick<User, "id" | "role">
  ): DoctorProfileUserRecord {
    return {
      id: user.id,
      role: user.role
    };
  }

  private toProfileRecord(
    profile: DoctorProfile
  ): DoctorProfileRecord {
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
