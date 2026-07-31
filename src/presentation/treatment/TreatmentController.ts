import type { NextFunction, Request, Response } from "express";
import type { AddTreatmentDto } from "../../application/treatment/dtos/AddTreatmentDto";
import type { UpdateTreatmentDto } from "../../application/treatment/dtos/UpdateTreatmentDto";
import type { AddTreatmentUseCase } from "../../application/treatment/use-cases/AddTreatmentUseCase";
import type { DeleteTreatmentUseCase } from "../../application/treatment/use-cases/DeleteTreatmentUseCase";
import type { GetTreatmentsByVisitUseCase } from "../../application/treatment/use-cases/GetTreatmentsByVisitUseCase";
import type { UpdateTreatmentUseCase } from "../../application/treatment/use-cases/UpdateTreatmentUseCase";
import type {
  TreatmentIdParams,
  VisitIdParams
} from "./treatment.types";

export class TreatmentController {
  constructor(
    private readonly addTreatmentUseCase: AddTreatmentUseCase,
    private readonly updateTreatmentUseCase: UpdateTreatmentUseCase,
    private readonly deleteTreatmentUseCase: DeleteTreatmentUseCase,
    private readonly getTreatmentsByVisitUseCase: GetTreatmentsByVisitUseCase
  ) {}

  create = async (
    request: Request<Record<string, never>, unknown, AddTreatmentDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.addTreatmentUseCase.execute(request.body);
      response.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  };

  updateById = async (
    request: Request<TreatmentIdParams, unknown, UpdateTreatmentDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.updateTreatmentUseCase.execute(
        request.params.id,
        request.body
      );
      response.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  };

  deleteById = async (
    request: Request<TreatmentIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteTreatmentUseCase.execute(request.params.id);
      response.status(204).send();
    } catch (error) { next(error); }
  };

  getByVisitId = async (
    request: Request<VisitIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getTreatmentsByVisitUseCase.execute(
        request.params.visitId
      );
      response.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  };
}
