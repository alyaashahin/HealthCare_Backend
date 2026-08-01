import { Prisma } from "@prisma/client";
import type {
  Booking,
  Treatment,
  Visit
} from "@prisma/client";
import type {
  BookingRecord,
  BookingStatusValue
} from "../../domain/repositories/IBookingRepository";
import type {
  CreateTreatmentData,
  CreateVisitData,
  FinanceVisitSearchFilters,
  IVisitRepository,
  TreatmentRecord,
  UpdateTreatmentData,
  VisitDetailsRecord,
  VisitRecord
} from "../../domain/repositories/IVisitRepository";
import { prisma } from "../database/prisma";

const includeDetails = {
  booking: {
    include: {
      doctor: {
        select: {
          id: true,
          name: true
        }
      },
      patient: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  },
  treatments: true
} as const;

type VisitDetailsPrismaResult = Prisma.VisitGetPayload<{
  include: typeof includeDetails;
}>;

export class PrismaVisitRepository implements IVisitRepository {
  async findBookingById(id: string): Promise<BookingRecord | null> {
    const booking = await prisma.booking.findUnique({ where: { id } });
    return booking ? this.toBookingRecord(booking) : null;
  }

  async findVisitById(id: string): Promise<VisitDetailsRecord | null> {
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: includeDetails
    });

    return visit ? this.toVisitDetailsRecord(visit) : null;
  }

  async findVisitByBookingId(
    bookingId: string
  ): Promise<VisitRecord | null> {
    const visit = await prisma.visit.findUnique({ where: { bookingId } });
    return visit ? this.toVisitRecord(visit) : null;
  }

  async findInProgressVisitByDoctorId(
    doctorId: string
  ): Promise<VisitRecord | null> {
    const visit = await prisma.visit.findFirst({
      where: {
        completedAt: null,
        booking: {
          doctorId,
          status: "IN_PROGRESS"
        }
      }
    });

    return visit ? this.toVisitRecord(visit) : null;
  }

  async startVisit(data: CreateVisitData): Promise<VisitRecord> {
    const visit = await prisma.$transaction(async (transaction) => {
      const createdVisit = await transaction.visit.create({
        data: {
          bookingId: data.bookingId,
          medicalNotes: data.medicalNotes,
          diagnosis: data.diagnosis,
          totalAmount: 0
        }
      });

      await transaction.booking.update({
        where: { id: data.bookingId },
        data: { status: "IN_PROGRESS" }
      });

      return createdVisit;
    });

    return this.toVisitRecord(visit);
  }

  async completeVisit(
    visitId: string,
    bookingId: string
  ): Promise<VisitRecord> {
    const visit = await prisma.$transaction(async (transaction) => {
      const completedVisit = await transaction.visit.update({
        where: { id: visitId },
        data: { completedAt: new Date() }
      });

      await transaction.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" }
      });

      return completedVisit;
    });

    return this.toVisitRecord(visit);
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatusValue
  ): Promise<BookingRecord> {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    return this.toBookingRecord(booking);
  }

  async findTreatmentById(id: string): Promise<TreatmentRecord | null> {
    const treatment = await prisma.treatment.findUnique({ where: { id } });
    return treatment ? this.toTreatmentRecord(treatment) : null;
  }

  async findTreatmentsByVisitId(
    visitId: string
  ): Promise<TreatmentRecord[]> {
    const treatments = await prisma.treatment.findMany({
      where: { visitId },
      orderBy: { treatmentName: "asc" }
    });

    return treatments.map((treatment) =>
      this.toTreatmentRecord(treatment)
    );
  }

  async createTreatment(
    data: CreateTreatmentData
  ): Promise<TreatmentRecord> {
    const treatment = await prisma.treatment.create({ data });
    return this.toTreatmentRecord(treatment);
  }

  async updateTreatment(
    id: string,
    data: UpdateTreatmentData
  ): Promise<TreatmentRecord> {
    const treatment = await prisma.treatment.update({
      where: { id },
      data
    });

    return this.toTreatmentRecord(treatment);
  }

  async deleteTreatment(id: string): Promise<void> {
    await prisma.treatment.delete({ where: { id } });
  }

  async calculateVisitTotal(visitId: string): Promise<Prisma.Decimal> {
    const result = await prisma.treatment.aggregate({
      where: { visitId },
      _sum: { amount: true }
    });

    return result._sum.amount ?? new Prisma.Decimal(0);
  }

  async updateVisitTotal(
    id: string,
    total: Prisma.Decimal
  ): Promise<VisitRecord> {
    const visit = await prisma.visit.update({
      where: { id },
      data: { totalAmount: total }
    });

    return this.toVisitRecord(visit);
  }

  async findVisitsByDoctorId(
    doctorId: string
  ): Promise<VisitDetailsRecord[]> {
    const visits = await prisma.visit.findMany({
      where: {
        booking: { doctorId }
      },
      include: includeDetails,
      orderBy: { createdAt: "desc" }
    });

    return visits.map((visit) => this.toVisitDetailsRecord(visit));
  }

  async findVisitsByPatientId(
    patientId: string
  ): Promise<VisitDetailsRecord[]> {
    const visits = await prisma.visit.findMany({
      where: {
        booking: { patientId }
      },
      include: includeDetails,
      orderBy: { createdAt: "desc" }
    });

    return visits.map((visit) => this.toVisitDetailsRecord(visit));
  }

  async searchVisits(
    filters: FinanceVisitSearchFilters
  ): Promise<VisitDetailsRecord[]> {
    const visits = await prisma.visit.findMany({
      where: {
        ...(filters.visitId ? { id: filters.visitId } : {}),
        booking: {
          ...(filters.doctorName
            ? {
                doctor: {
                  name: {
                    contains: filters.doctorName,
                    mode: "insensitive"
                  }
                }
              }
            : {}),
          ...(filters.patientName
            ? {
                patient: {
                  name: {
                    contains: filters.patientName,
                    mode: "insensitive"
                  }
                }
              }
            : {})
        }
      },
      include: includeDetails,
      orderBy: { createdAt: "desc" }
    });

    return visits.map((visit) => this.toVisitDetailsRecord(visit));
  }

  private toBookingRecord(booking: Booking): BookingRecord {
    return {
      id: booking.id,
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      createdAt: booking.createdAt
    };
  }

  private toVisitRecord(visit: Visit): VisitRecord {
    return {
      id: visit.id,
      bookingId: visit.bookingId,
      medicalNotes: visit.medicalNotes,
      diagnosis: visit.diagnosis,
      totalAmount: visit.totalAmount,
      completedAt: visit.completedAt,
      createdAt: visit.createdAt
    };
  }

  private toTreatmentRecord(treatment: Treatment): TreatmentRecord {
    return {
      id: treatment.id,
      visitId: treatment.visitId,
      treatmentName: treatment.treatmentName,
      amount: treatment.amount,
      notes: treatment.notes
    };
  }

  private toVisitDetailsRecord(
    visit: VisitDetailsPrismaResult
  ): VisitDetailsRecord {
    return {
      ...this.toVisitRecord(visit),
      booking: {
        ...this.toBookingRecord(visit.booking),
        doctor: visit.booking.doctor,
        patient: visit.booking.patient
      },
      treatments: visit.treatments.map((treatment) =>
        this.toTreatmentRecord(treatment)
      )
    };
  }
}
