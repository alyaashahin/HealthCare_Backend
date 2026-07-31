import { Router } from "express";

import { doctorProfileController } from "../../infrastructure/dependencies/doctorProfileDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";

import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";

import type {
  DoctorProfileUserIdParams,
  UpdateDoctorProfileBody
} from "./DoctorProfileController";

import type { CreateDoctorProfileDto } from "../../application/doctor-profile/dtos/CreateDoctorProfileDto";

export const doctorProfileRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

doctorProfileRouter.post<
  Record<string, never>,
  unknown,
  CreateDoctorProfileDto
>(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  doctorProfileController.create
);

doctorProfileRouter.get<DoctorProfileUserIdParams>(
  "/:userId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  doctorProfileController.getByUserId
);

doctorProfileRouter.patch<
  DoctorProfileUserIdParams,
  unknown,
  UpdateDoctorProfileBody
>(
  "/:userId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  doctorProfileController.updateByUserId
);