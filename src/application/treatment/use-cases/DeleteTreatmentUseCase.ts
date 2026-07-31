import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { TreatmentInputValidator } from "../services/TreatmentInputValidator";

export class DeleteTreatmentUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: TreatmentInputValidator
  ) {}

  async execute(treatmentIdInput: string): Promise<void> {
    const treatmentId = this.validator.validateId(
      treatmentIdInput,
      "Treatment ID"
    );

    if (!(await this.visitRepository.findTreatmentById(treatmentId))) {
      throw new NotFoundError("Treatment not found", "TREATMENT_NOT_FOUND");
    }

    await this.visitRepository.deleteTreatmentAndSyncTotal(treatmentId);
  }
}
