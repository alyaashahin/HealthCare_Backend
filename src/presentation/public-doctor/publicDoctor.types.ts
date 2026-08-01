import type { ParamsDictionary } from "express-serve-static-core";

export interface DoctorIdParams extends ParamsDictionary {
  doctorId: string;
}
