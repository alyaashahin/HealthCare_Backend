export interface BookingResponseDto {
  id: string;
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: "BOOKED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
}
