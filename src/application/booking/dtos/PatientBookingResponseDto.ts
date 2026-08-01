import type { BookingStatusValue } from "../../../domain/repositories/IBookingRepository";

export interface PatientBookingResponseDto {
  id: string;
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  status: BookingStatusValue;
  createdAt: Date;
  doctor: {
    id: string;
    name: string;
    specialization: string | null;
    imageUrl: string | null;
  };
}
