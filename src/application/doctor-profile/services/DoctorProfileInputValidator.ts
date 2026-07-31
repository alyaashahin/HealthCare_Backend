import { ValidationError } from "../../../domain/errors/ValidationError";

export class DoctorProfileInputValidator {
  validateUserId(userId?: string): string {
    const value = userId?.trim();

    if (!value) {
      throw new ValidationError(
        "User ID is required",
        "USER_ID_REQUIRED"
      );
    }

    return value;
  }

  validateSpecialization(value: string): string {
    const specialization = value?.trim();

    if (!specialization) {
      throw new ValidationError(
        "Specialization is required",
        "SPECIALIZATION_REQUIRED"
      );
    }

    if (specialization.length > 100) {
      throw new ValidationError(
        "Specialization cannot exceed 100 characters",
        "SPECIALIZATION_TOO_LONG"
      );
    }

    return specialization;
  }

  validateOptionalText(
    value: string | null | undefined,
    fieldName: string,
    maxLength?: number
  ): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;

    const normalizedValue = value.trim();

    if (maxLength && normalizedValue.length > maxLength) {
      throw new ValidationError(
        `${fieldName} cannot exceed ${maxLength} characters`,
        `${fieldName.toUpperCase().replace(/\s+/g, "_")}_TOO_LONG`
      );
    }

    return normalizedValue || null;
  }

  validateImageUrl(
    value: string | null | undefined
  ): string | null | undefined {
    const normalizedValue = this.validateOptionalText(
      value,
      "Image URL",
      2048
    );

    if (!normalizedValue) return normalizedValue;

    try {
      const url = new URL(normalizedValue);

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        throw new Error();
      }
    } catch {
      throw new ValidationError(
        "Image URL is invalid",
        "INVALID_IMAGE_URL"
      );
    }

    return normalizedValue;
  }

  validateExperienceYears(
    value: number | null | undefined
  ): number | null | undefined {
    if (value === undefined || value === null) {
      return value;
    }

    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 80
    ) {
      throw new ValidationError(
        "Experience years must be a whole number between 0 and 80",
        "INVALID_EXPERIENCE_YEARS"
      );
    }

    return value;
  }
}