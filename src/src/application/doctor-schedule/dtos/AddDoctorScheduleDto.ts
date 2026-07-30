import type { DayOfWeek } from "@prisma/client";

export interface AddDoctorScheduleDto {
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
}
