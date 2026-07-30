import { CreateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/CreateDoctorProfileUseCase";
import { GetDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/GetDoctorProfileUseCase";
import { UpdateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/UpdateDoctorProfileUseCase";
import { DoctorProfileInputValidator } from "../../application/doctor-profile/services/DoctorProfileInputValidator";
import { DoctorProfileController } from "../../presentation/doctor-profile/DoctorProfileController";
import { PrismaDoctorProfileRepository } from "../repositories/PrismaDoctorProfileRepository";

const doctorProfileRepository = new PrismaDoctorProfileRepository();
const doctorProfileValidator = new DoctorProfileInputValidator();

const createDoctorProfileUseCase = new CreateDoctorProfileUseCase(
  doctorProfileRepository,
  doctorProfileValidator
);

const getDoctorProfileUseCase = new GetDoctorProfileUseCase(
  doctorProfileRepository,
  doctorProfileValidator
);

const updateDoctorProfileUseCase = new UpdateDoctorProfileUseCase(
  doctorProfileRepository,
  doctorProfileValidator
);

export const doctorProfileController = new DoctorProfileController(
  createDoctorProfileUseCase,
  getDoctorProfileUseCase,
  updateDoctorProfileUseCase
);
