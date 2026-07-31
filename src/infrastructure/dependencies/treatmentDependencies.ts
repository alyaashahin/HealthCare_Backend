import { TreatmentInputValidator } from "../../application/treatment/services/TreatmentInputValidator";
import { AddTreatmentUseCase } from "../../application/treatment/use-cases/AddTreatmentUseCase";
import { DeleteTreatmentUseCase } from "../../application/treatment/use-cases/DeleteTreatmentUseCase";
import { GetTreatmentsByVisitUseCase } from "../../application/treatment/use-cases/GetTreatmentsByVisitUseCase";
import { UpdateTreatmentUseCase } from "../../application/treatment/use-cases/UpdateTreatmentUseCase";
import { TreatmentController } from "../../presentation/treatment/TreatmentController";
import { visitRepository } from "./visitDependencies";

const treatmentValidator = new TreatmentInputValidator();

export const treatmentController = new TreatmentController(
  new AddTreatmentUseCase(visitRepository, treatmentValidator),
  new UpdateTreatmentUseCase(visitRepository, treatmentValidator),
  new DeleteTreatmentUseCase(visitRepository, treatmentValidator),
  new GetTreatmentsByVisitUseCase(visitRepository, treatmentValidator)
);
