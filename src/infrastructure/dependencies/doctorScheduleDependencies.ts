import { AddDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/AddDoctorScheduleUseCase";
import { DeleteDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/DeleteDoctorScheduleUseCase";
import { GetDoctorSchedulesUseCase } from "../../application/doctor-schedule/use-cases/GetDoctorSchedulesUseCase";
import { UpdateDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/UpdateDoctorScheduleUseCase";

import { DoctorScheduleRules } from "../../application/doctor-schedule/validators/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../../application/doctor-schedule/validators/DoctorScheduleValidator";

import { DoctorScheduleController } from "../../presentation/doctor-schedule/DoctorScheduleController";

import { PrismaDoctorScheduleRepository } from "../repositories/PrismaDoctorScheduleRepository";

const repository = new PrismaDoctorScheduleRepository();

const validator = new DoctorScheduleValidator();

const rules = new DoctorScheduleRules(repository);

const addUseCase = new AddDoctorScheduleUseCase(
  repository,
  validator,
  rules
);

const updateUseCase = new UpdateDoctorScheduleUseCase(
  repository,
  validator,
  rules
);

const deleteUseCase = new DeleteDoctorScheduleUseCase(
  repository,
  validator
);

const getUseCase = new GetDoctorSchedulesUseCase(
  repository,
  rules
);

export const doctorScheduleController =
  new DoctorScheduleController(
    addUseCase,
    updateUseCase,
    deleteUseCase,
    getUseCase
  );