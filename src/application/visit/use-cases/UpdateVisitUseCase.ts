import type {
  IVisitRepository,
  UpdateVisitData
} from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import type { UpdateVisitDto } from "../dtos/UpdateVisitDto";
import type { VisitResponseDto } from "../dtos/VisitResponseDto";
import { VisitInputValidator } from "../services/VisitInputValidator";

export class UpdateVisitUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: VisitInputValidator
  ) {}

  async execute(
    visitIdInput: string,
    input: UpdateVisitDto
  ): Promise<VisitResponseDto> {
    const visitId = this.validator.validateId(visitIdInput, "Visit ID");

    if (!(await this.visitRepository.findVisitById(visitId))) {
      throw new NotFoundError("Visit not found", "VISIT_NOT_FOUND");
    }

    const data: UpdateVisitData = {};

    if (input.medicalNotes !== undefined) {
      data.medicalNotes = this.validator.validateMedicalNotes(
        input.medicalNotes
      );
    }

    if (input.diagnosis !== undefined) {
      data.diagnosis =
        this.validator.validateOptionalText(input.diagnosis) ?? null;
    }

    if (input.completedAt !== undefined) {
      data.completedAt =
        this.validator.validateOptionalDate(input.completedAt) ?? null;
    }

    if (Object.keys(data).length === 0) {
      throw new ValidationError(
        "At least one visit field must be provided",
        "EMPTY_VISIT_UPDATE"
      );
    }

    return this.visitRepository.updateVisit(visitId, data);
  }
}
