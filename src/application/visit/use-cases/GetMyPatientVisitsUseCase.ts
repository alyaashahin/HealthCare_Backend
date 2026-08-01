import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
export class GetMyPatientVisitsUseCase { constructor(private r:IVisitRepository){} execute(actor:AuthenticatedActorDto){if(actor.role!=="PATIENT")throw new ForbiddenError("Patient role is required","PATIENT_REQUIRED");return this.r.findVisitsByPatientId(actor.userId);} }
