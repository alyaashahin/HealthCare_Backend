import type { DayOfWeek } from "@prisma/client";

export type ScheduleUserRole = "PATIENT" | "DOCTOR" | "FINANCE" | "ADMIN";

export interface ScheduleUserRecord {
  id: string;
  role: ScheduleUserRole;
}

export interface DoctorScheduleRecord {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
  createdAt: Date;
}

export interface CreateDoctorScheduleData {
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
}

export interface UpdateDoctorScheduleData {
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
}

export interface IDoctorScheduleRepository {
  findUserById(userId: string): Promise<ScheduleUserRecord | null>;
  findById(id: string): Promise<DoctorScheduleRecord | null>;
  findByDoctorId(doctorId: string): Promise<DoctorScheduleRecord[]>;
  findExactDuplicate(
    doctorId: string,
    dayOfWeek: DayOfWeek,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: string
  ): Promise<DoctorScheduleRecord | null>;
  findOverlapping(
    doctorId: string,
    dayOfWeek: DayOfWeek,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: string
  ): Promise<DoctorScheduleRecord | null>;
  create(data: CreateDoctorScheduleData): Promise<DoctorScheduleRecord>;
  update(
    id: string,
    data: UpdateDoctorScheduleData
  ): Promise<DoctorScheduleRecord>;
  delete(id: string): Promise<void>;
}
