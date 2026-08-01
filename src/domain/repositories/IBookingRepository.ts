import type { UserRecord } from "./IUserRepository";

export type BookingStatusValue =
  | "BOOKED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type DayOfWeekValue =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BookingRecord {
  id: string;
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: BookingStatusValue;
  createdAt: Date;
}

export interface PatientBookingRecord extends BookingRecord {
  doctor: {
    id: string;
    name: string;
    doctorProfile: {
      specialization: string;
      imageUrl: string | null;
    } | null;
  };
}

export interface DoctorBookingRecord extends BookingRecord {
  patient: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DoctorScheduleRecord {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeekValue;
  startTime: Date;
  endTime: Date;
  durationInMinutes: number;
  createdAt: Date;
}

export interface CreateBookingData {
  patientId: string;
  doctorId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: "BOOKED";
}

export interface IBookingRepository {
  findUserById(userId: string): Promise<UserRecord | null>;
  findById(bookingId: string): Promise<BookingRecord | null>;

  findDoctorSchedules(
    doctorId: string,
    dayOfWeek: DayOfWeekValue
  ): Promise<DoctorScheduleRecord[]>;

  findDoctorBookingsByDate(
    doctorId: string,
    bookingDate: Date
  ): Promise<BookingRecord[]>;

  findPatientBookingsByDate(
    patientId: string,
    bookingDate: Date
  ): Promise<BookingRecord[]>;

  create(data: CreateBookingData): Promise<BookingRecord>;
  cancelById(bookingId: string): Promise<BookingRecord>;
  findByDoctorId(doctorId: string): Promise<DoctorBookingRecord[]>;
  findByPatientId(patientId: string): Promise<PatientBookingRecord[]>;
}
