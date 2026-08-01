import { Router } from "express";
import { bookingController } from "../../infrastructure/dependencies/bookingDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";
import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";
import type {
  BookingIdParams,
  DoctorIdParams
} from "./booking.types";

export const bookingRouter = Router();
export const doctorAvailabilityRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

bookingRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("PATIENT"),
  bookingController.create
);

bookingRouter.get(
  "/my",
  authenticationMiddleware,
  authorizeRoles("PATIENT"),
  bookingController.getMyBookings
);

bookingRouter.get(
  "/doctor/my",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  bookingController.getDoctorBookings
);

bookingRouter.delete<BookingIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("PATIENT"),
  bookingController.cancel
);

doctorAvailabilityRouter.get<DoctorIdParams>(
  "/:doctorId/available-slots",
  authenticationMiddleware,
  bookingController.getAvailableSlots
);
