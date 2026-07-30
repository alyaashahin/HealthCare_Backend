import type { ParamsDictionary } from "express-serve-static-core";

export interface BookingIdParams extends ParamsDictionary {
  id: string;
}

export interface DoctorIdParams extends ParamsDictionary {
  doctorId: string;
}

export interface PatientIdParams extends ParamsDictionary {
  patientId: string;
}
