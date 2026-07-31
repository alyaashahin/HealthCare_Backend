import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { TreatmentResponseDto } from "../dtos/TreatmentResponseDto";
import { TreatmentInputValidator } from "../services/TreatmentInputValidator";

export class GetTreatmentsByVisitUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: TreatmentInputValidator
  ) {}

  async execute(visitIdInput: string): Promise<TreatmentResponseDto[]> {
    const visitId = this.validator.validateId(visitIdInput, "Visit ID");

    if (!(await this.visitRepository.findVisitById(visitId))) {
      throw new NotFoundError("Visit not found", "VISIT_NOT_FOUND");
    }

    return this.visitRepository.findTreatmentsByVisitId(visitId);
  }
}
