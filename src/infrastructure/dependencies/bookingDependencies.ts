import { BookingInputValidator } from "../../application/booking/services/BookingInputValidator";
import { CancelBookingUseCase } from "../../application/booking/use-cases/CancelBookingUseCase";
import { CompleteBookingUseCase } from "../../application/booking/use-cases/CompleteBookingUseCase";
import { CreateBookingUseCase } from "../../application/booking/use-cases/CreateBookingUseCase";
import { GetDoctorBookingsUseCase } from "../../application/booking/use-cases/GetDoctorBookingsUseCase";
import { GetPatientBookingsUseCase } from "../../application/booking/use-cases/GetPatientBookingsUseCase";
import { BookingController } from "../../presentation/booking/BookingController";
import { PrismaBookingRepository } from "../repositories/PrismaBookingRepository";

const bookingRepository = new PrismaBookingRepository();
const bookingValidator = new BookingInputValidator();

export const bookingController = new BookingController(
  new CreateBookingUseCase(bookingRepository, bookingValidator),
  new CancelBookingUseCase(bookingRepository, bookingValidator),
  new CompleteBookingUseCase(bookingRepository, bookingValidator),
  new GetDoctorBookingsUseCase(bookingRepository, bookingValidator),
  new GetPatientBookingsUseCase(bookingRepository, bookingValidator)
);
