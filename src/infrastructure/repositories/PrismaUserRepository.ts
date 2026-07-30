import type { User, UserRole } from "@prisma/client";
import type {
  CreateUserData,
  IUserRepository,
  UserRecord,
  UserRoleValue
} from "../../domain/repositories/IUserRepository";
import { prisma } from "../database/prisma";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? this.toRecord(user) : null;
  }

  async create(data: CreateUserData): Promise<UserRecord> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role as UserRole
      }
    });

    return this.toRecord(user);
  }

  private toRecord(user: User): UserRecord {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as UserRoleValue,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
