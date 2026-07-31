import type {
  IVisitRepository,
  UpdateTreatmentData
} from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { UpdateTreatmentDto } from "../dtos/UpdateTreatmentDto";
import type { TreatmentResponseDto } from "../dtos/TreatmentResponseDto";
import { TreatmentInputValidator } from "../services/TreatmentInputValidator";

export class UpdateTreatmentUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: TreatmentInputValidator
  ) {}

  async execute(
    treatmentIdInput: string,
    input: UpdateTreatmentDto
  ): Promise<TreatmentResponseDto> {
    const treatmentId = this.validator.validateId(
      treatmentIdInput,
      "Treatment ID"
    );

    if (!(await this.visitRepository.findTreatmentById(treatmentId))) {
      throw new NotFoundError("Treatment not found", "TREATMENT_NOT_FOUND");
    }

    const data: UpdateTreatmentData = {};

    if (input.treatmentName !== undefined) {
      data.treatmentName = this.validator.validateName(input.treatmentName);
    }

    if (input.amount !== undefined) {
      data.amount = this.validator.validateAmount(input.amount);
    }

    if (input.notes !== undefined) {
      data.notes = this.validator.validateOptionalNotes(input.notes) ?? null;
    }

    if (Object.keys(data).length === 0) {
      throw new ValidationError(
        "At least one treatment field must be provided",
        "EMPTY_TREATMENT_UPDATE"
      );
    }

    return this.visitRepository.updateTreatmentAndSyncTotal(
      treatmentId,
      data
    );
  }
}
