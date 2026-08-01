import type {
  Booking,
  DoctorSchedule,
  Prisma,
  User
} from "@prisma/client";
import type {
  BookingRecord,
  CreateBookingData,
  DayOfWeekValue,
  DoctorBookingRecord,
  DoctorScheduleRecord,
  IBookingRepository,
  PatientBookingRecord
} from "../../domain/repositories/IBookingRepository";
import type { UserRecord } from "../../domain/repositories/IUserRepository";
import { prisma } from "../database/prisma";

type PatientBookingPrismaResult = Prisma.BookingGetPayload<{
  include: {
    doctor: {
      select: {
        id: true;
        name: true;
        doctorProfile: {
          select: {
            specialization: true;
            imageUrl: true;
          };
        };
      };
    };
  };
}>;

type DoctorBookingPrismaResult = Prisma.BookingGetPayload<{
  include: {
    patient: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export class PrismaBookingRepository implements IBookingRepository {
  async findUserById(userId: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? this.toUserRecord(user) : null;
  }

  async findById(bookingId: string): Promise<BookingRecord | null> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    return booking ? this.toBookingRecord(booking) : null;
  }

  async findDoctorSchedules(
    doctorId: string,
    dayOfWeek: DayOfWeekValue
  ): Promise<DoctorScheduleRecord[]> {
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId, dayOfWeek },
      orderBy: { startTime: "asc" }
    });
    return schedules.map((schedule) => this.toScheduleRecord(schedule));
  }

  async findDoctorBookingsByDate(
    doctorId: string,
    bookingDate: Date
  ): Promise<BookingRecord[]> {
    const bookings = await prisma.booking.findMany({
      where: {
        doctorId,
        bookingDate,
        status: { not: "CANCELLED" }
      },
      orderBy: { startTime: "asc" }
    });
    return bookings.map((booking) => this.toBookingRecord(booking));
  }

  async findPatientBookingsByDate(
    patientId: string,
    bookingDate: Date
  ): Promise<BookingRecord[]> {
    const bookings = await prisma.booking.findMany({
      where: {
        patientId,
        bookingDate,
        status: { not: "CANCELLED" }
      },
      orderBy: { startTime: "asc" }
    });
    return bookings.map((booking) => this.toBookingRecord(booking));
  }

  async create(data: CreateBookingData): Promise<BookingRecord> {
    const booking = await prisma.booking.create({ data });
    return this.toBookingRecord(booking);
  }

  async cancelById(bookingId: string): Promise<BookingRecord> {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });
    return this.toBookingRecord(booking);
  }

  async findByPatientId(
    patientId: string
  ): Promise<PatientBookingRecord[]> {
    const bookings: PatientBookingPrismaResult[] =
      await prisma.booking.findMany({
        where: { patientId },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              doctorProfile: {
                select: {
                  specialization: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: [{ bookingDate: "desc" }, { startTime: "desc" }]
      });

    return bookings.map((booking) => this.toPatientBookingRecord(booking));
  }

  async findByDoctorId(
    doctorId: string
  ): Promise<DoctorBookingRecord[]> {
    const bookings: DoctorBookingPrismaResult[] =
      await prisma.booking.findMany({
        where: { doctorId },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [{ bookingDate: "desc" }, { startTime: "desc" }]
      });

    return bookings.map((booking) => this.toDoctorBookingRecord(booking));
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

  private toPatientBookingRecord(
    booking: PatientBookingPrismaResult
  ): PatientBookingRecord {
    return {
      ...this.toBookingRecord(booking),
      doctor: {
        id: booking.doctor.id,
        name: booking.doctor.name,
        doctorProfile: booking.doctor.doctorProfile
      }
    };
  }

  private toDoctorBookingRecord(
    booking: DoctorBookingPrismaResult
  ): DoctorBookingRecord {
    return {
      ...this.toBookingRecord(booking),
      patient: {
        id: booking.patient.id,
        name: booking.patient.name,
        email: booking.patient.email
      }
    };
  }

  private toScheduleRecord(schedule: DoctorSchedule): DoctorScheduleRecord {
    return {
      id: schedule.id,
      doctorId: schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      durationInMinutes: schedule.durationInMinutes,
      createdAt: schedule.createdAt
    };
  }

  private toUserRecord(user: User): UserRecord {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
