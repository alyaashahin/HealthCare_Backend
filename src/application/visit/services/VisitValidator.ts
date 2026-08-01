import { ValidationError } from "../../../domain/errors/ValidationError";
export class VisitValidator {
  id(value: string, name: string): string { const v=value?.trim(); if(!v) throw new ValidationError(`${name} is required`,"ID_REQUIRED"); return v; }
  notes(value: string): string { const v=value?.trim(); if(!v) throw new ValidationError("Medical notes are required","MEDICAL_NOTES_REQUIRED"); return v; }
  optional(value: string|null|undefined): string|null|undefined { if(value===undefined||value===null)return value; return value.trim()||null; }
}
