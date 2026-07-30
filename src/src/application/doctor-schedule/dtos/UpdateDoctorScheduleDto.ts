import type { DayOfWeek } from "@prisma/client";

export interface UpdateDoctorScheduleDto {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  durationInMinutes?: number;
}
