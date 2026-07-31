import { VisitInputValidator } from "../../application/visit/services/VisitInputValidator";
import { CreateVisitUseCase } from "../../application/visit/use-cases/CreateVisitUseCase";
import { GetVisitUseCase } from "../../application/visit/use-cases/GetVisitUseCase";
import { UpdateVisitUseCase } from "../../application/visit/use-cases/UpdateVisitUseCase";
import { VisitController } from "../../presentation/visit/VisitController";
import { PrismaVisitRepository } from "../repositories/PrismaVisitRepository";

export const visitRepository = new PrismaVisitRepository();
const visitValidator = new VisitInputValidator();

export const visitController = new VisitController(
  new CreateVisitUseCase(visitRepository, visitValidator),
  new GetVisitUseCase(visitRepository, visitValidator),
  new UpdateVisitUseCase(visitRepository, visitValidator)
);
