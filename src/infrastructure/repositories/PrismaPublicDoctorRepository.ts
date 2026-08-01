import type {
  IPublicDoctorRepository,
  PublicDoctorRecord
} from "../../domain/repositories/IPublicDoctorRepository";
import { prisma } from "../database/prisma";

export class PrismaPublicDoctorRepository
  implements IPublicDoctorRepository
{
  async findAll(searchName?: string): Promise<PublicDoctorRecord[]> {
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        doctorProfile: { isNot: null },
        ...(searchName
          ? {
              name: {
                contains: searchName,
                mode: "insensitive"
              }
            }
          : {})
      },
      select: {
        id: true,
        name: true,
        doctorProfile: {
          select: {
            specialization: true,
            bio: true,
            imageUrl: true,
            experienceYears: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return doctors.flatMap((doctor) => {
      if (!doctor.doctorProfile) return [];

      return [{
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.doctorProfile.specialization,
        bio: doctor.doctorProfile.bio,
        imageUrl: doctor.doctorProfile.imageUrl,
        experienceYears: doctor.doctorProfile.experienceYears
      }];
    });
  }

  async findById(doctorId: string): Promise<PublicDoctorRecord | null> {
    const doctor = await prisma.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        doctorProfile: { isNot: null }
      },
      select: {
        id: true,
        name: true,
        doctorProfile: {
          select: {
            specialization: true,
            bio: true,
            imageUrl: true,
            experienceYears: true
          }
        }
      }
    });

    if (!doctor?.doctorProfile) return null;

    return {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.doctorProfile.specialization,
      bio: doctor.doctorProfile.bio,
      imageUrl: doctor.doctorProfile.imageUrl,
      experienceYears: doctor.doctorProfile.experienceYears
    };
  }
}
