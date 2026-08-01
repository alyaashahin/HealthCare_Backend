import { GetPublicDoctorUseCase } from "../../application/public-doctor/use-cases/GetPublicDoctorUseCase";
import { GetPublicDoctorsUseCase } from "../../application/public-doctor/use-cases/GetPublicDoctorsUseCase";
import { PublicDoctorController } from "../../presentation/public-doctor/PublicDoctorController";
import { PrismaPublicDoctorRepository } from "../repositories/PrismaPublicDoctorRepository";

const repository = new PrismaPublicDoctorRepository();

export const publicDoctorController = new PublicDoctorController(
  new GetPublicDoctorsUseCase(repository),
  new GetPublicDoctorUseCase(repository)
);
