import type { ParamsDictionary } from "express-serve-static-core";

export interface VisitIdParams extends ParamsDictionary {
  id: string;
}
