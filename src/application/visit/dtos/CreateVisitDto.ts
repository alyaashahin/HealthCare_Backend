export interface CreateVisitDto {
  bookingId: string;
  medicalNotes: string;
  diagnosis?: string | null;
  completedAt?: string | null;
}
