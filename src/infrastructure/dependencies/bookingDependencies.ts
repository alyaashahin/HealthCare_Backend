import { BookingInputValidator } from "../../application/booking/services/BookingInputValidator";
import { CancelBookingUseCase } from "../../application/booking/use-cases/CancelBookingUseCase";
import { CreateBookingUseCase } from "../../application/booking/use-cases/CreateBookingUseCase";
import { GetAvailableSlotsUseCase } from "../../application/booking/use-cases/GetAvailableSlotsUseCase";
import { GetDoctorBookingsUseCase } from "../../application/booking/use-cases/GetDoctorBookingsUseCase";
import { GetMyBookingsUseCase } from "../../application/booking/use-cases/GetMyBookingsUseCase";
import { BookingController } from "../../presentation/booking/BookingController";
import { PrismaBookingRepository } from "../repositories/PrismaBookingRepository";

const bookingRepository = new PrismaBookingRepository();
const bookingValidator = new BookingInputValidator();

export const bookingController = new BookingController(
  new CreateBookingUseCase(bookingRepository, bookingValidator),
  new GetMyBookingsUseCase(bookingRepository),
  new GetDoctorBookingsUseCase(bookingRepository),
  new GetAvailableSlotsUseCase(bookingRepository, bookingValidator),
  new CancelBookingUseCase(bookingRepository, bookingValidator)
);
