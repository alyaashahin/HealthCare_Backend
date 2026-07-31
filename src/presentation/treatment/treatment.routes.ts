import { Router } from "express";
import { treatmentController } from "../../infrastructure/dependencies/treatmentDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";
import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";
import type {
  TreatmentIdParams,
  VisitIdParams
} from "./treatment.types";

export const treatmentRouter = Router();
const authenticationMiddleware = createAuthenticationMiddleware(tokenService);

treatmentRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  treatmentController.create
);

treatmentRouter.patch<TreatmentIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  treatmentController.updateById
);

treatmentRouter.delete<TreatmentIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  treatmentController.deleteById
);

treatmentRouter.get<VisitIdParams>(
  "/visit/:visitId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN", "FINANCE", "PATIENT"),
  treatmentController.getByVisitId
);
