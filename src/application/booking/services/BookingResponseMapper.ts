import type {
  BookingRecord,
  DoctorBookingRecord,
  PatientBookingRecord
} from "../../../domain/repositories/IBookingRepository";
import { formatTime } from "../../../shared/utils/dateTime";
import type { BookingResponseDto } from "../dtos/BookingResponseDto";
import type { DoctorBookingResponseDto } from "../dtos/DoctorBookingResponseDto";
import type { PatientBookingResponseDto } from "../dtos/PatientBookingResponseDto";

export class BookingResponseMapper {
  static toDto(booking: BookingRecord): BookingResponseDto {
    return {
      id: booking.id,
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      bookingDate: booking.bookingDate,
      startTime: formatTime(booking.startTime),
      endTime: formatTime(booking.endTime),
      status: booking.status,
      createdAt: booking.createdAt
    };
  }

  static toPatientDto(
    booking: PatientBookingRecord
  ): PatientBookingResponseDto {
    return {
      id: booking.id,
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      bookingDate: booking.bookingDate,
      startTime: formatTime(booking.startTime),
      endTime: formatTime(booking.endTime),
      status: booking.status,
      createdAt: booking.createdAt,
      doctor: {
        id: booking.doctor.id,
        name: booking.doctor.name,
        specialization:
          booking.doctor.doctorProfile?.specialization ?? null,
        imageUrl: booking.doctor.doctorProfile?.imageUrl ?? null
      }
    };
  }

  static toDoctorDto(
    booking: DoctorBookingRecord
  ): DoctorBookingResponseDto {
    return {
      id: booking.id,
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      bookingDate: booking.bookingDate,
      startTime: formatTime(booking.startTime),
      endTime: formatTime(booking.endTime),
      status: booking.status,
      createdAt: booking.createdAt,
      patient: {
        id: booking.patient.id,
        name: booking.patient.name,
        email: booking.patient.email
      }
    };
  }

  static toPatientDtoList(
    bookings: PatientBookingRecord[]
  ): PatientBookingResponseDto[] {
    return bookings.map((booking) => this.toPatientDto(booking));
  }

  static toDoctorDtoList(
    bookings: DoctorBookingRecord[]
  ): DoctorBookingResponseDto[] {
    return bookings.map((booking) => this.toDoctorDto(booking));
  }
}
