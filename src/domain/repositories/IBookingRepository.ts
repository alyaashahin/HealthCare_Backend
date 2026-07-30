import type {
  Booking,
  BookingStatus,
  DayOfWeek,
  DoctorSchedule,
  User
} from "@prisma/client";

export interface CreateBookingData {
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
}

export interface IBookingRepository {
  findUserById(id: string): Promise<User | null>;

  findById(id: string): Promise<Booking | null>;

  findDoctorSchedules(
    doctorId: string,
    dayOfWeek: DayOfWeek
  ): Promise<DoctorSchedule[]>;

  findDoctorConflictingBooking(
    doctorId: string,
    bookingDate: Date,
    startTime: Date,
    endTime: Date
  ): Promise<Booking | null>;

  findPatientConflictingBooking(
    patientId: string,
    bookingDate: Date,
    startTime: Date,
    endTime: Date
  ): Promise<Booking | null>;

  create(data: CreateBookingData): Promise<Booking>;

  updateStatus(
    id: string,
    status: BookingStatus
  ): Promise<Booking>;

  findByDoctorId(doctorId: string): Promise<Booking[]>;

  findByPatientId(patientId: string): Promise<Booking[]>;
}
