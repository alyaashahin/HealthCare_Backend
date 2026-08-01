import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
export class GetMyDoctorVisitsUseCase { constructor(private r:IVisitRepository){} execute(actor:AuthenticatedActorDto){if(actor.role!=="DOCTOR")throw new ForbiddenError("Doctor role is required","DOCTOR_REQUIRED");return this.r.findVisitsByDoctorId(actor.userId);} }
