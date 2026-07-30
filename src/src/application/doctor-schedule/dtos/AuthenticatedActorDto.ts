import type { UserRoleValue } from "../../../domain/repositories/IUserRepository";

export interface AuthenticatedActorDto {
  userId: string;
  role: UserRoleValue;
}
