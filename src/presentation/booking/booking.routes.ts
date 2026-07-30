import { Router } from "express";

import { bookingController } from "../../infrastructure/dependencies/bookingDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";

import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";

import type {
  BookingIdParams,
  DoctorIdParams,
  PatientIdParams
} from "./booking.types";

export const bookingRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

bookingRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("PATIENT", "ADMIN"),
  bookingController.create
);

bookingRouter.patch<BookingIdParams>(
  "/:id/cancel",
  authenticationMiddleware,
  authorizeRoles("PATIENT", "ADMIN"),
  bookingController.cancel
);

bookingRouter.patch<BookingIdParams>(
  "/:id/complete",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  bookingController.complete
);

bookingRouter.get<DoctorIdParams>(
  "/doctor/:doctorId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  bookingController.getDoctorBookings
);

bookingRouter.get<PatientIdParams>(
  "/patient/:patientId",
  authenticationMiddleware,
  authorizeRoles("PATIENT", "ADMIN"),
  bookingController.getPatientBookings
);
