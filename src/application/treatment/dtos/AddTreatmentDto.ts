export interface AddTreatmentDto {
  visitId: string;
  treatmentName: string;
  amount: string | number;
  notes?: string | null;
}
