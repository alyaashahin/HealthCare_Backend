export interface CreateBookingDto {
  patientId: string;
  doctorId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}
