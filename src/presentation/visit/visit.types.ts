import type {
  ParamsDictionary
} from "express-serve-static-core";
import type { ParsedQs } from "qs";

export interface EmptyParams extends ParamsDictionary {}

export interface BookingIdParams extends ParamsDictionary {
  bookingId: string;
}

export interface VisitIdParams extends ParamsDictionary {
  visitId: string;
}

export interface TreatmentIdParams extends ParamsDictionary {
  id: string;
}

export interface FinanceFilters extends ParsedQs {
  visitId?: string;
  doctorName?: string;
  patientName?: string;
}
