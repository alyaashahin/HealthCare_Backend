import { ValidationError } from "../../../domain/errors/ValidationError";

export class VisitInputValidator {
  validateId(value: string, fieldName: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new ValidationError(`${fieldName} is required`, "ID_REQUIRED");
    }

    return normalizedValue;
  }

  validateMedicalNotes(value: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new ValidationError(
        "Medical notes are required",
        "MEDICAL_NOTES_REQUIRED"
      );
    }

    return normalizedValue;
  }

  validateOptionalText(
    value: string | null | undefined
  ): string | null | undefined {
    if (value === undefined || value === null) return value;
    return value.trim() || null;
  }

  validateOptionalDate(
    value: string | null | undefined
  ): Date | null | undefined {
    if (value === undefined || value === null) return value;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new ValidationError("Invalid completion date", "INVALID_DATE");
    }

    return date;
  }
}
