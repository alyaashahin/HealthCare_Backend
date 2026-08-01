import { Router } from "express";
import { doctorProfileController } from "../../infrastructure/dependencies/doctorProfileDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";
import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";

export const doctorProfileRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

doctorProfileRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorProfileController.create
);

doctorProfileRouter.get(
  "/me",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorProfileController.getMe
);

doctorProfileRouter.patch(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  doctorProfileController.update
);
