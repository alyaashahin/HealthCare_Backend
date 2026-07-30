import bcrypt from "bcrypt";
import type { IHashService } from "../../domain/services/IHashService";

export class BcryptHashService implements IHashService {
  constructor(private readonly saltRounds: number = 12) {
    if (!Number.isInteger(saltRounds) || saltRounds < 10 || saltRounds > 15) {
      throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 10 and 15");
    }
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
