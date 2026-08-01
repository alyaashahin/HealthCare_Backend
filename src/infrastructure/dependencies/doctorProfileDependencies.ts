import { DoctorProfileInputValidator } from "../../application/doctor-profile/services/DoctorProfileInputValidator";
import { CreateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/CreateDoctorProfileUseCase";
import { GetDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/GetDoctorProfileUseCase";
import { UpdateDoctorProfileUseCase } from "../../application/doctor-profile/use-cases/UpdateDoctorProfileUseCase";
import { DoctorProfileController } from "../../presentation/doctor-profile/DoctorProfileController";
import { PrismaDoctorProfileRepository } from "../repositories/PrismaDoctorProfileRepository";

const repository = new PrismaDoctorProfileRepository();
const validator = new DoctorProfileInputValidator();

export const doctorProfileController = new DoctorProfileController(
  new CreateDoctorProfileUseCase(repository, validator),
  new GetDoctorProfileUseCase(repository),
  new UpdateDoctorProfileUseCase(repository, validator)
);
