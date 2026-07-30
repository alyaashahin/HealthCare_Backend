import { AddDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/AddDoctorScheduleUseCase";
import { DeleteDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/DeleteDoctorScheduleUseCase";
import { GetDoctorSchedulesUseCase } from "../../application/doctor-schedule/use-cases/GetDoctorSchedulesUseCase";
import { UpdateDoctorScheduleUseCase } from "../../application/doctor-schedule/use-cases/UpdateDoctorScheduleUseCase";
import { DoctorSchedulePolicy } from "../../application/doctor-schedule/services/DoctorSchedulePolicy";
import { DoctorScheduleRules } from "../../application/doctor-schedule/services/DoctorScheduleRules";
import { DoctorScheduleValidator } from "../../application/doctor-schedule/services/DoctorScheduleValidator";
import { DoctorScheduleController } from "../../presentation/doctor-schedule/DoctorScheduleController";
import { PrismaDoctorScheduleRepository } from "../repositories/PrismaDoctorScheduleRepository";

const repository = new PrismaDoctorScheduleRepository();
const validator = new DoctorScheduleValidator();
const rules = new DoctorScheduleRules(repository);
const policy = new DoctorSchedulePolicy();

const addUseCase = new AddDoctorScheduleUseCase(
  repository,
  validator,
  rules,
  policy
);

const updateUseCase = new UpdateDoctorScheduleUseCase(
  repository,
  validator,
  rules,
  policy
);

const deleteUseCase = new DeleteDoctorScheduleUseCase(
  repository,
  validator,
  policy
);

const getUseCase = new GetDoctorSchedulesUseCase(
  repository,
  validator,
  rules,
  policy
);

export const doctorScheduleController = new DoctorScheduleController(
  addUseCase,
  updateUseCase,
  deleteUseCase,
  getUseCase
);
