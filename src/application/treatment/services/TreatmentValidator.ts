import { Prisma } from "@prisma/client";
import { ValidationError } from "../../../domain/errors/ValidationError";
export class TreatmentValidator {
  id(v:string,n:string){const x=v?.trim();if(!x)throw new ValidationError(`${n} is required`,"ID_REQUIRED");return x;}
  name(v:string){const x=v?.trim();if(!x)throw new ValidationError("Treatment name is required","TREATMENT_NAME_REQUIRED");if(x.length>255)throw new ValidationError("Treatment name is too long","TREATMENT_NAME_TOO_LONG");return x;}
  amount(v:string|number){let x:Prisma.Decimal;try{x=new Prisma.Decimal(v);}catch{throw new ValidationError("Invalid amount","INVALID_AMOUNT");}if(x.lte(0))throw new ValidationError("Amount must be greater than zero","AMOUNT_MUST_BE_POSITIVE");if(x.decimalPlaces()>2)throw new ValidationError("Amount supports maximum 2 decimal places","INVALID_AMOUNT_PRECISION");return x;}
  notes(v:string|null|undefined){if(v===undefined||v===null)return v;return v.trim()||null;}
}
