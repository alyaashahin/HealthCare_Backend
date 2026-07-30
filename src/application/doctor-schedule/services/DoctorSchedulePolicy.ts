import type { AuthenticatedActorDto } from "../dtos/AuthenticatedActorDto";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";

export class DoctorSchedulePolicy {
  ensureCanManageDoctor(
    actor: AuthenticatedActorDto,
    doctorId: string
  ): void {
    if (actor.role === "ADMIN") return;

    if (actor.role === "DOCTOR" && actor.userId === doctorId) return;

    throw new ForbiddenError(
      "You can only manage your own doctor schedules",
      "DOCTOR_SCHEDULE_ACCESS_DENIED"
    );
  }

  ensureCanViewDoctor(
    actor: AuthenticatedActorDto,
    doctorId: string
  ): void {
    if (actor.role === "ADMIN") return;

    if (actor.role === "DOCTOR" && actor.userId === doctorId) return;

    throw new ForbiddenError(
      "You can only view your own doctor schedules",
      "DOCTOR_SCHEDULE_VIEW_DENIED"
    );
  }
}
