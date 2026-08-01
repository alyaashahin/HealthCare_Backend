import { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { AddDoctorScheduleDto } from "../../application/doctor-schedule/dtos/AddDoctorScheduleDto";
import type { UpdateDoctorScheduleDto } from "../../application/doctor-schedule/dtos/UpdateDoctorScheduleDto";

import { doctorScheduleController } from "../../infrastructure/dependencies/doctorScheduleDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";

import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";

import type { ScheduleIdParams } from "./DoctorScheduleController";

export const doctorScheduleRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

doctorScheduleRouter.post<
  ParamsDictionary,
  unknown,
  AddDoctorScheduleDto
>(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorScheduleController.create
);

doctorScheduleRouter.get(
  "/my",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorScheduleController.getMySchedules
);

doctorScheduleRouter.patch<
  ScheduleIdParams,
  unknown,
  UpdateDoctorScheduleDto
>(
  "/:scheduleId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorScheduleController.update
);

doctorScheduleRouter.delete<ScheduleIdParams>(
  "/:scheduleId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorScheduleController.delete
);