import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { VisitResponseDto } from "../dtos/VisitResponseDto";
import { VisitInputValidator } from "../services/VisitInputValidator";

export class GetVisitUseCase {
  constructor(
    private readonly visitRepository: IVisitRepository,
    private readonly validator: VisitInputValidator
  ) {}

  async execute(visitIdInput: string): Promise<VisitResponseDto> {
    const visitId = this.validator.validateId(visitIdInput, "Visit ID");
    const visit = await this.visitRepository.findVisitById(visitId);

    if (!visit) {
      throw new NotFoundError("Visit not found", "VISIT_NOT_FOUND");
    }

    return visit;
  }
}
