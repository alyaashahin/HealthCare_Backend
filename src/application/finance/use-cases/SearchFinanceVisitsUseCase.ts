import type { AuthenticatedActorDto } from "../../shared/dtos/AuthenticatedActorDto";
import type { IVisitRepository, FinanceVisitSearchFilters } from "../../../domain/repositories/IVisitRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import type { FinanceVisitFiltersDto } from "../dtos/FinanceVisitFiltersDto";
export class SearchFinanceVisitsUseCase { constructor(private r:IVisitRepository){} execute(actor:AuthenticatedActorDto,input:FinanceVisitFiltersDto){if(actor.role!=="FINANCE")throw new ForbiddenError("Finance role is required","FINANCE_REQUIRED");const f:FinanceVisitSearchFilters={};if(input.visitId?.trim())f.visitId=input.visitId.trim();if(input.doctorName?.trim())f.doctorName=input.doctorName.trim();if(input.patientName?.trim())f.patientName=input.patientName.trim();return this.r.searchVisits(f);} }
