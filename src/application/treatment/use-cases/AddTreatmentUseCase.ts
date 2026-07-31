import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { AddTreatmentDto } from "../dtos/AddTreatmentDto";
import type { TreatmentResponseDto } from "../dtos/TreatmentResponseDto";
import { TreatmentInputValidator } from "../services/TreatmentInputValidator";

export class AddTreatmentUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: TreatmentInputValidator
  ) {}

  async execute(input: AddTreatmentDto): Promise<TreatmentResponseDto> {
    const visitId = this.validator.validateId(input.visitId, "Visit ID");

    if (!(await this.visitRepository.findVisitById(visitId))) {
      throw new NotFoundError("Visit not found", "VISIT_NOT_FOUND");
    }

    return this.visitRepository.createTreatmentAndSyncTotal({
      visitId,
      treatmentName: this.validator.validateName(input.treatmentName),
      amount: this.validator.validateAmount(input.amount),
      notes: this.validator.validateOptionalNotes(input.notes) ?? null
    });
  }
}
