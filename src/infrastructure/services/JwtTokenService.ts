import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type {
  ITokenService,
  TokenPayload
} from "../../domain/services/ITokenService";
import type { UserRoleValue } from "../../domain/repositories/IUserRepository";
import { AppError } from "../../domain/errors/AppError";

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: SignOptions["expiresIn"] = "1d"
  ) {
    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }
  }

  async sign(payload: TokenPayload): Promise<string> {
    return jwt.sign(
      {
        email: payload.email,
        role: payload.role
      },
      this.secret,
      {
        subject: payload.sub,
        expiresIn: this.expiresIn,
        algorithm: "HS256"
      }
    );
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ["HS256"]
      });

      if (typeof decoded === "string") {
        throw new AppError("Invalid token", 401, "INVALID_TOKEN");
      }

      return this.toTokenPayload(decoded);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
    }
  }

  private toTokenPayload(decoded: JwtPayload): TokenPayload {
    if (
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      !this.isUserRole(decoded.role)
    ) {
      throw new AppError("Invalid token payload", 401, "INVALID_TOKEN");
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
  }

  private isUserRole(value: unknown): value is UserRoleValue {
    return ["PATIENT", "DOCTOR", "FINANCE", "ADMIN"].includes(String(value));
  }
}
