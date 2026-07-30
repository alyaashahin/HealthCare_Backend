import type { DayOfWeek } from "@prisma/client";

export interface DoctorScheduleResponseDto {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
  createdAt: Date;
}
