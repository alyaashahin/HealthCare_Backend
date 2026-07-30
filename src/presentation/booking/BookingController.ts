import type {
NextFunction,
Request,
Response
} from "express";

import type { CreateBookingDto } from "../../application/booking/dtos/CreateBookingDto";

import type { CreateBookingUseCase } from "../../application/booking/use-cases/CreateBookingUseCase";
import type { CancelBookingUseCase } from "../../application/booking/use-cases/CancelBookingUseCase";
import type { CompleteBookingUseCase } from "../../application/booking/use-cases/CompleteBookingUseCase";
import type { GetDoctorBookingsUseCase } from "../../application/booking/use-cases/GetDoctorBookingsUseCase";
import type { GetPatientBookingsUseCase } from "../../application/booking/use-cases/GetPatientBookingsUseCase";

import type {
BookingIdParams,
DoctorIdParams,
PatientIdParams
} from "./booking.types";

export class BookingController {
constructor(
private readonly createBookingUseCase: CreateBookingUseCase,
private readonly cancelBookingUseCase: CancelBookingUseCase,
private readonly completeBookingUseCase: CompleteBookingUseCase,
private readonly getDoctorBookingsUseCase: GetDoctorBookingsUseCase,
private readonly getPatientBookingsUseCase: GetPatientBookingsUseCase
) {}

create = async (
request: Request<
Record<string, never>,
unknown,
CreateBookingDto
>,
response: Response,
next: NextFunction
): Promise<void> => {
try {
const result =
await this.createBookingUseCase.execute(request.body);

response.status(201).json({
success: true,
data: result
});
} catch (error) {
next(error);
}
};

cancel = async (
request: Request<BookingIdParams>,
response: Response,
next: NextFunction
): Promise<void> => {
try {
const result =
await this.cancelBookingUseCase.execute(
request.params.id
);

response.status(200).json({
success: true,
data: result
});
} catch (error) {
next(error);
}
};

complete = async (
request: Request<BookingIdParams>,
response: Response,
next: NextFunction
): Promise<void> => {
try {
const result =
await this.completeBookingUseCase.execute(
request.params.id
);

response.status(200).json({
success: true,
data: result
});
} catch (error) {
next(error);
}
};

getDoctorBookings = async (
request: Request<DoctorIdParams>,
response: Response,
next: NextFunction
): Promise<void> => {
try {
const result =
await this.getDoctorBookingsUseCase.execute(
request.params.doctorId
);

response.status(200).json({
success: true,
data: result
});
} catch (error) {
next(error);
}
};

getPatientBookings = async (
request: Request<PatientIdParams>,
response: Response,
next: NextFunction
): Promise<void> => {
try {
const result =
await this.getPatientBookingsUseCase.execute(
request.params.patientId
);

response.status(200).json({
success: true,
data: result
});
} catch (error) {
next(error);
}
};
}