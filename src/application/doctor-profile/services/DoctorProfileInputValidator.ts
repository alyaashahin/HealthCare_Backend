import { ValidationError } from "../../../domain/errors/ValidationError";

export class DoctorProfileInputValidator {
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

  validateBio(value: string | null | undefined): string | null | undefined {
    return this.validateOptionalText(value, "Bio", 5000);
  }

  validatePhone(value: string | null | undefined): string | null | undefined {
    const phone = this.validateOptionalText(value, "Phone", 30);

    if (!phone) return phone;

    if (!/^\+?[0-9 ()-]{7,30}$/.test(phone)) {
      throw new ValidationError("Phone number is invalid", "INVALID_PHONE");
    }

    return phone;
  }

  validateImageUrl(
    value: string | null | undefined
  ): string | null | undefined {
    const imageUrl = this.validateOptionalText(value, "Image URL", 2048);

    if (!imageUrl) return imageUrl;

    try {
      const url = new URL(imageUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Unsupported protocol");
      }
    } catch {
      throw new ValidationError("Image URL is invalid", "INVALID_IMAGE_URL");
    }

    return imageUrl;
  }

  validateExperienceYears(
    value: number | null | undefined
  ): number | null | undefined {
    if (value === undefined || value === null) return value;

    if (!Number.isInteger(value) || value < 0 || value > 80) {
      throw new ValidationError(
        "Experience years must be a whole number between 0 and 80",
        "INVALID_EXPERIENCE_YEARS"
      );
    }

    return value;
  }

  private validateOptionalText(
    value: string | null | undefined,
    fieldName: string,
    maxLength: number
  ): string | null | undefined {
    if (value === undefined || value === null) return value;

    const normalizedValue = value.trim();

    if (normalizedValue.length > maxLength) {
      throw new ValidationError(
        `${fieldName} cannot exceed ${maxLength} characters`,
        `${fieldName.toUpperCase().replace(/\s+/g, "_")}_TOO_LONG`
      );
    }

    return normalizedValue || null;
  }
}
