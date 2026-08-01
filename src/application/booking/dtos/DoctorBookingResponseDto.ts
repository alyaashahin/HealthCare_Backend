import type { BookingStatusValue } from "../../../domain/repositories/IBookingRepository";

export interface DoctorBookingResponseDto {
  id: string;
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  status: BookingStatusValue;
  createdAt: Date;
  patient: {
    id: string;
    name: string;
    email: string;
  };
}
