import type { ParamsDictionary } from "express-serve-static-core";

export interface TreatmentIdParams extends ParamsDictionary {
  id: string;
}

export interface VisitIdParams extends ParamsDictionary {
  visitId: string;
}
