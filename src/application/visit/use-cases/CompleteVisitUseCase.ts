import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { VisitValidator } from "../services/VisitValidator";
export class CompleteVisitUseCase {
 constructor(private r:IVisitRepository,private v:VisitValidator){}
 async execute(actor:AuthenticatedActorDto,visitIdInput:string){
  const visitId=this.v.id(visitIdInput,"Visit ID"); const visit=await this.r.findVisitById(visitId);
  if(!visit)throw new NotFoundError("Visit not found","VISIT_NOT_FOUND");
  if(actor.role!=="DOCTOR"||actor.userId!==visit.booking.doctorId)throw new ForbiddenError("Only the assigned doctor can complete this visit","VISIT_COMPLETE_DENIED");
  if(visit.booking.status!=="IN_PROGRESS")throw new ConflictError("Visit booking must be IN_PROGRESS","INVALID_BOOKING_STATUS");
  if(visit.completedAt!==null)throw new ConflictError("Visit is already completed","VISIT_ALREADY_COMPLETED");
  if(visit.treatments.length===0)throw new ConflictError("Visit must contain at least one treatment","TREATMENT_REQUIRED");
  return this.r.completeVisit(visit.id,visit.bookingId);
 }
}
