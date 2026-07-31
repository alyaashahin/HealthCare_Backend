import { Router } from "express";
import { visitController } from "../../infrastructure/dependencies/visitDependencies";
import { tokenService } from "../../infrastructure/dependencies/authDependencies";
import { createAuthenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { authorizeRoles } from "../middlewares/authorizationMiddleware";
import type { VisitIdParams } from "./visit.types";

export const visitRouter = Router();
const authenticationMiddleware = createAuthenticationMiddleware(tokenService);

visitRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  visitController.create
);

visitRouter.get<VisitIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN", "FINANCE", "PATIENT"),
  visitController.getById
);

visitRouter.patch<VisitIdParams>(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("DOCTOR", "ADMIN"),
  visitController.updateById
);
