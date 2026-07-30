import type {
  BookingStatus,
  DayOfWeek
} from "@prisma/client";
import type {
  CreateBookingData,
  IBookingRepository
} from "../../domain/repositories/IBookingRepository";
import { prisma } from "../database/prisma";

export class PrismaBookingRepository implements IBookingRepository {
  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  findById(id: string) {
    return prisma.booking.findUnique({ where: { id } });
  }

  findDoctorSchedules(doctorId: string, dayOfWeek: DayOfWeek) {
    return prisma.doctorSchedule.findMany({
      where: { doctorId, dayOfWeek },
      orderBy: { startTime: "asc" }
    });
  }

  findDoctorConflictingBooking(
    doctorId: string,
    bookingDate: Date,
    startTime: Date,
    endTime: Date
  ) {
    return prisma.booking.findFirst({
      where: {
        doctorId,
        bookingDate,
        status: { not: "CANCELLED" },
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
  }

  findPatientConflictingBooking(
    patientId: string,
    bookingDate: Date,
    startTime: Date,
    endTime: Date
  ) {
    return prisma.booking.findFirst({
      where: {
        patientId,
        bookingDate,
        status: { not: "CANCELLED" },
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
  }

  create(data: CreateBookingData) {
    return prisma.booking.create({ data });
  }

  updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status }
    });
  }

  findByDoctorId(doctorId: string) {
    return prisma.booking.findMany({
      where: { doctorId },
      orderBy: [{ bookingDate: "desc" }, { startTime: "desc" }]
    });
  }

  findByPatientId(patientId: string) {
    return prisma.booking.findMany({
      where: { patientId },
      orderBy: [{ bookingDate: "desc" }, { startTime: "desc" }]
    });
  }
}
