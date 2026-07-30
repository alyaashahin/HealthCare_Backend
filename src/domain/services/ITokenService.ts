import type { UserRoleValue } from "../repositories/IUserRepository";

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRoleValue;
}

export interface ITokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
