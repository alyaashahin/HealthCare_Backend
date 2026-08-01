import type { Prisma } from "@prisma/client";
import type { BookingRecord, BookingStatusValue } from "./IBookingRepository";

export interface VisitRecord {
  id: string; bookingId: string; medicalNotes: string; diagnosis: string | null;
  totalAmount: Prisma.Decimal; completedAt: Date | null; createdAt: Date;
}
export interface TreatmentRecord {
  id: string; visitId: string; treatmentName: string;
  amount: Prisma.Decimal; notes: string | null;
}
export interface VisitDetailsRecord extends VisitRecord {
  booking: BookingRecord & {
    doctor: { id: string; name: string };
    patient: { id: string; name: string; email: string };
  };
  treatments: TreatmentRecord[];
}
export interface CreateVisitData { bookingId: string; medicalNotes: string; diagnosis: string | null; }
export interface CreateTreatmentData { visitId: string; treatmentName: string; amount: Prisma.Decimal; notes: string | null; }
export interface UpdateTreatmentData { treatmentName?: string; amount?: Prisma.Decimal; notes?: string | null; }
export interface FinanceVisitSearchFilters { visitId?: string; doctorName?: string; patientName?: string; }

export interface IVisitRepository {
  findBookingById(bookingId: string): Promise<BookingRecord | null>;
  findVisitById(visitId: string): Promise<VisitDetailsRecord | null>;
  findVisitByBookingId(bookingId: string): Promise<VisitRecord | null>;
  findInProgressVisitByDoctorId(doctorId: string): Promise<VisitRecord | null>;
  startVisit(data: CreateVisitData): Promise<VisitRecord>;
  completeVisit(visitId: string, bookingId: string): Promise<VisitRecord>;
  updateBookingStatus(bookingId: string, status: BookingStatusValue): Promise<BookingRecord>;

  findTreatmentById(treatmentId: string): Promise<TreatmentRecord | null>;
  findTreatmentsByVisitId(visitId: string): Promise<TreatmentRecord[]>;
  createTreatment(data: CreateTreatmentData): Promise<TreatmentRecord>;
  updateTreatment(treatmentId: string, data: UpdateTreatmentData): Promise<TreatmentRecord>;
  deleteTreatment(treatmentId: string): Promise<void>;
  calculateVisitTotal(visitId: string): Promise<Prisma.Decimal>;
  updateVisitTotal(visitId: string, total: Prisma.Decimal): Promise<VisitRecord>;

  findVisitsByDoctorId(doctorId: string): Promise<VisitDetailsRecord[]>;
  findVisitsByPatientId(patientId: string): Promise<VisitDetailsRecord[]>;
  searchVisits(filters: FinanceVisitSearchFilters): Promise<VisitDetailsRecord[]>;
}
