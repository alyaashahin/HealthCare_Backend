import type {
  Prisma,
  PrismaClient
} from "@prisma/client";
import type {
  CreateTreatmentData,
  CreateVisitData,
  IVisitRepository,
  UpdateTreatmentData,
  UpdateVisitData
} from "../../domain/repositories/IVisitRepository";
import { prisma } from "../database/prisma";

export class PrismaVisitRepository implements IVisitRepository {
  findBookingById(bookingId: string) {
    return prisma.booking.findUnique({ where: { id: bookingId } });
  }

  findVisitById(visitId: string) {
    return prisma.visit.findUnique({ where: { id: visitId } });
  }

  findVisitByBookingId(bookingId: string) {
    return prisma.visit.findUnique({ where: { bookingId } });
  }

  createVisit(data: CreateVisitData) {
    return prisma.visit.create({
      data: {
        ...data,
        totalAmount: 0
      }
    });
  }

  updateVisit(visitId: string, data: UpdateVisitData) {
    return prisma.visit.update({
      where: { id: visitId },
      data
    });
  }

  findTreatmentById(treatmentId: string) {
    return prisma.treatment.findUnique({ where: { id: treatmentId } });
  }

  findTreatmentsByVisitId(visitId: string) {
    return prisma.treatment.findMany({
      where: { visitId },
      orderBy: { treatmentName: "asc" }
    });
  }

createTreatmentAndSyncTotal(data: CreateTreatmentData) {
  return prisma.$transaction(async (transaction) => {
    const treatment = await transaction.treatment.create({
      data: {
        visitId: data.visitId,
        treatmentName: data.treatmentName,
        amount: data.amount,
        notes: data.notes
      }
    });

    await this.syncVisitTotal(
      transaction,
      data.visitId
    );

    return treatment;
  });
}


  updateTreatmentAndSyncTotal(
    treatmentId: string,
    data: UpdateTreatmentData
  ) {
    return prisma.$transaction(async (transaction) => {
      const treatment = await transaction.treatment.update({
        where: { id: treatmentId },
        data
      });
      await this.syncVisitTotal(transaction, treatment.visitId);
      return treatment;
    });
  }

  async deleteTreatmentAndSyncTotal(treatmentId: string): Promise<void> {
    await prisma.$transaction(async (transaction) => {
      const treatment = await transaction.treatment.delete({
        where: { id: treatmentId }
      });
      await this.syncVisitTotal(transaction, treatment.visitId);
    });
  }

  private async syncVisitTotal(
    transaction: Prisma.TransactionClient,
    visitId: string
  ): Promise<void> {
    const total = await transaction.treatment.aggregate({
      where: { visitId },
      _sum: { amount: true }
    });

    await transaction.visit.update({
      where: { id: visitId },
      data: { totalAmount: total._sum.amount ?? 0 }
    });
  }
}
