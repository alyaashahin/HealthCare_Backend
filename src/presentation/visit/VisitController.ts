import type { NextFunction, Request, Response } from "express";
import type { CreateVisitDto } from "../../application/visit/dtos/CreateVisitDto";
import type { UpdateVisitDto } from "../../application/visit/dtos/UpdateVisitDto";
import type { CreateVisitUseCase } from "../../application/visit/use-cases/CreateVisitUseCase";
import type { GetVisitUseCase } from "../../application/visit/use-cases/GetVisitUseCase";
import type { UpdateVisitUseCase } from "../../application/visit/use-cases/UpdateVisitUseCase";
import type { VisitIdParams } from "./visit.types";

export class VisitController {
  constructor(
    private readonly createVisitUseCase: CreateVisitUseCase,
    private readonly getVisitUseCase: GetVisitUseCase,
    private readonly updateVisitUseCase: UpdateVisitUseCase
  ) {}

  create = async (
    request: Request<Record<string, never>, unknown, CreateVisitDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.createVisitUseCase.execute(request.body);
      response.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  };

  getById = async (
    request: Request<VisitIdParams>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getVisitUseCase.execute(request.params.id);
      response.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  };

  updateById = async (
    request: Request<VisitIdParams, unknown, UpdateVisitDto>,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.updateVisitUseCase.execute(
        request.params.id,
        request.body
      );
      response.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  };
}
