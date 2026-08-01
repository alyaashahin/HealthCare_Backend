import type { DayOfWeek, DoctorSchedule, User } from "@prisma/client";
import type {
  CreateDoctorScheduleData,
  DoctorScheduleRecord,
  IDoctorScheduleRepository,
  ScheduleUserRecord,
  UpdateDoctorScheduleData
} from "../../domain/repositories/IDoctorScheduleRepository";
import { prisma } from "../database/prisma";

export class PrismaDoctorScheduleRepository
  implements IDoctorScheduleRepository {
  async findUserById(userId: string): Promise<ScheduleUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    return user ? this.toUserRecord(user) : null;
  }

  async findById(id: string): Promise<DoctorScheduleRecord | null> {
    const schedule = await prisma.doctorSchedule.findUnique({ where: { id } });
    return schedule ? this.toRecord(schedule) : null;
  }
  
  async findByIdAndDoctorId(
    id: string,
    doctorId: string
  ): Promise<DoctorScheduleRecord | null> {
    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        id,
        doctorId
      }
    });

    return schedule ? this.toRecord(schedule) : null;
  }

  async findByDoctorId(doctorId: string): Promise<DoctorScheduleRecord[]> {
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
    });

    return schedules.map((schedule) => this.toRecord(schedule));
  }

  async findExactDuplicate(
    doctorId: string,
    dayOfWeek: DayOfWeek,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: string
  ): Promise<DoctorScheduleRecord | null> {
    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        startTime,
        endTime,
        ...(excludeScheduleId ? { id: { not: excludeScheduleId } } : {})
      }
    });

    return schedule ? this.toRecord(schedule) : null;
  }

  async findOverlapping(
    doctorId: string,
    dayOfWeek: DayOfWeek,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: string
  ): Promise<DoctorScheduleRecord | null> {
    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        ...(excludeScheduleId ? { id: { not: excludeScheduleId } } : {})
      }
    });

    return schedule ? this.toRecord(schedule) : null;
  }

  async create(
    data: CreateDoctorScheduleData
  ): Promise<DoctorScheduleRecord> {
    const schedule = await prisma.doctorSchedule.create({ data });
    return this.toRecord(schedule);
  }

  async update(
    id: string,
    data: UpdateDoctorScheduleData
  ): Promise<DoctorScheduleRecord> {
    const schedule = await prisma.doctorSchedule.update({
      where: { id },
      data
    });
    return this.toRecord(schedule);
  }

  async delete(id: string): Promise<void> {
    await prisma.doctorSchedule.delete({ where: { id } });
  }

  private toUserRecord(
    user: Pick<User, "id" | "role">
  ): ScheduleUserRecord {
    return { id: user.id, role: user.role };
  }

  private toRecord(schedule: DoctorSchedule): DoctorScheduleRecord {
    return {
      id: schedule.id,
      doctorId: schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      durationInMinutes: schedule.durationInMinutes,
      createdAt: schedule.createdAt
    };
  }
}
