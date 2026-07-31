import { Prisma } from "@prisma/client";
import { ValidationError } from "../../../domain/errors/ValidationError";

export class TreatmentInputValidator {
  validateId(value: string, fieldName: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new ValidationError(`${fieldName} is required`, "ID_REQUIRED");
    }

    return normalizedValue;
  }

  validateName(value: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new ValidationError(
        "Treatment name is required",
        "TREATMENT_NAME_REQUIRED"
      );
    }

    if (normalizedValue.length > 255) {
      throw new ValidationError(
        "Treatment name cannot exceed 255 characters",
        "TREATMENT_NAME_TOO_LONG"
      );
    }

    return normalizedValue;
  }

  validateAmount(value: string | number): Prisma.Decimal {
    let amount: Prisma.Decimal;

    try {
      amount = new Prisma.Decimal(value);
    } catch {
      throw new ValidationError(
        "Treatment amount must be a valid number",
        "INVALID_TREATMENT_AMOUNT"
      );
    }

    if (amount.lte(0)) {
      throw new ValidationError(
        "Treatment amount must be greater than zero",
        "TREATMENT_AMOUNT_MUST_BE_POSITIVE"
      );
    }

    if (amount.decimalPlaces() > 2) {
      throw new ValidationError(
        "Treatment amount cannot contain more than 2 decimal places",
        "INVALID_TREATMENT_AMOUNT_PRECISION"
      );
    }

    return amount;
  }

  validateOptionalNotes(
    value: string | null | undefined
  ): string | null | undefined {
    if (value === undefined || value === null) return value;
    return value.trim() || null;
  }
}
