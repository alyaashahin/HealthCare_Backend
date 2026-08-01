import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IVisitRepository } from "../../../domain/repositories/IVisitRepository";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import type { StartVisitDto } from "../dtos/StartVisitDto";
import { VisitValidator } from "../services/VisitValidator";
export class StartVisitUseCase {
 constructor(private r:IVisitRepository,private v:VisitValidator){}
 async execute(actor:AuthenticatedActorDto,bookingIdInput:string,input:StartVisitDto){
  const bookingId=this.v.id(bookingIdInput,"Booking ID"); const b=await this.r.findBookingById(bookingId);
  if(!b)throw new NotFoundError("Booking not found","BOOKING_NOT_FOUND");
  if(actor.role!=="DOCTOR"||actor.userId!==b.doctorId)throw new ForbiddenError("Only the assigned doctor can start this visit","VISIT_START_DENIED");
  if(b.status!=="BOOKED")throw new ConflictError("Booking status must be BOOKED","INVALID_BOOKING_STATUS");
  if(await this.r.findVisitByBookingId(bookingId))throw new ConflictError("Visit already exists","VISIT_ALREADY_EXISTS");
  if(await this.r.findInProgressVisitByDoctorId(actor.userId))throw new ConflictError("Doctor already has an active visit","DOCTOR_HAS_ACTIVE_VISIT");
  return this.r.startVisit({bookingId,medicalNotes:this.v.notes(input.medicalNotes),diagnosis:this.v.optional(input.diagnosis)??null});
 }
}
