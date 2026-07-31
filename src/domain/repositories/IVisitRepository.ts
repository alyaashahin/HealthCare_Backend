import type {
  Booking,
  Prisma,
  Treatment,
  Visit
} from "@prisma/client";

export interface CreateVisitData {
  bookingId: string;
  medicalNotes: string;
  diagnosis: string | null;
  completedAt: Date | null;
}

export interface UpdateVisitData {
  medicalNotes?: string;
  diagnosis?: string | null;
  completedAt?: Date | null;
}

export interface CreateTreatmentData {
  visitId: string;
  treatmentName: string;
  amount: Prisma.Decimal;
  notes: string | null;
}

export interface UpdateTreatmentData {
  treatmentName?: string;
  amount?: Prisma.Decimal;
  notes?: string | null;
}

export interface IVisitRepository {
  findBookingById(bookingId: string): Promise<Booking | null>;
  findVisitById(visitId: string): Promise<Visit | null>;
  findVisitByBookingId(bookingId: string): Promise<Visit | null>;
  createVisit(data: CreateVisitData): Promise<Visit>;
  updateVisit(visitId: string, data: UpdateVisitData): Promise<Visit>;

  findTreatmentById(treatmentId: string): Promise<Treatment | null>;
  findTreatmentsByVisitId(visitId: string): Promise<Treatment[]>;
  createTreatmentAndSyncTotal(
    data: CreateTreatmentData
  ): Promise<Treatment>;
  updateTreatmentAndSyncTotal(
    treatmentId: string,
    data: UpdateTreatmentData
  ): Promise<Treatment>;
  deleteTreatmentAndSyncTotal(treatmentId: string): Promise<void>;
}
