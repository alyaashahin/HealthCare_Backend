import type { IPublicDoctorRepository } from "../../../domain/repositories/IPublicDoctorRepository";
import type { PublicDoctorResponseDto } from "../dtos/PublicDoctorResponseDto";
import { PublicDoctorResponseMapper } from "../services/PublicDoctorResponseMapper";

export class GetPublicDoctorsUseCase {
  constructor(
    private readonly repository: IPublicDoctorRepository
  ) {}

  async execute(searchName?: string): Promise<PublicDoctorResponseDto[]> {
    const normalizedSearch = searchName?.trim() || undefined;
    const doctors = await this.repository.findAll(normalizedSearch);
    return PublicDoctorResponseMapper.toDtoList(doctors);
  }
}
