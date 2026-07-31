export interface VisitResponseDto {
  id: string;
  bookingId: string;
  medicalNotes: string;
  diagnosis: string | null;
  totalAmount: unknown;
  completedAt: Date | null;
  createdAt: Date;
}
