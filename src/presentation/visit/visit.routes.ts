import { Router } from "express";
import { visitController } from "../../infrastructure/dependencies/visitDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";
import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";
import type {
  BookingIdParams,
  EmptyParams,
  FinanceFilters,
  TreatmentIdParams,
  VisitIdParams
} from "./visit.types";

export const visitRouter = Router();
export const financeVisitRouter = Router();
export const patientVisitRouter = Router();
export const treatmentRouter = Router();

const authenticationMiddleware =
  createAuthenticationMiddleware(tokenService);

visitRouter.post<BookingIdParams>(
  "/start/:bookingId",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.start
);

visitRouter.post<VisitIdParams>(
  "/:visitId/complete",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.complete
);

visitRouter.get(
  "/my",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.myDoctor
);

visitRouter.post<VisitIdParams>(
  "/:visitId/treatments",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.addTreatment
);

visitRouter.get<VisitIdParams>(
  "/:visitId/treatments",
  authenticationMiddleware,
  visitController.getTreatments
);

treatmentRouter.patch<TreatmentIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.updateTreatment
);

treatmentRouter.delete<TreatmentIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR"),
  visitController.deleteTreatment
);

patientVisitRouter.get(
  "/me/visits",
  authenticationMiddleware,
  authorizeRoles("PATIENT"),
  visitController.myPatient
);

financeVisitRouter.get<
  EmptyParams,
  unknown,
  unknown,
  FinanceFilters
>(
  "/visits",
  authenticationMiddleware,
  authorizeRoles("FINANCE"),
  visitController.finance
);
