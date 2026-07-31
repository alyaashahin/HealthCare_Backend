export interface TreatmentResponseDto {
  id: string;
  visitId: string;
  treatmentName: string;
  amount: unknown;
  notes: string | null;
}
