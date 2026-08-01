import { Router } from "express";
import { bookingController } from "../../infrastructure/dependencies/bookingDependencies";
import { publicDoctorController } from "../../infrastructure/dependencies/publicDoctorDependencies";
import type { AvailableSlotsQuery } from "../booking/booking.types";
import type { DoctorIdParams } from "./publicDoctor.types";

export const publicDoctorRouter = Router();

publicDoctorRouter.get(
  "/",
  publicDoctorController.getAll
);

// Public: no token is required to view available appointments.
publicDoctorRouter.get<
  DoctorIdParams,
  unknown,
  unknown,
  AvailableSlotsQuery
>(
  "/:doctorId/available-slots",
  bookingController.getAvailableSlots
);

publicDoctorRouter.get<DoctorIdParams>(
  "/:doctorId",
  publicDoctorController.getById
);
