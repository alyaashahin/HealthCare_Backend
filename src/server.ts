import "dotenv/config";

import express from "express";
import cors from "cors";

import { authRouter } from "./presentation/auth/auth.routes";
import { doctorProfileRouter } from "./presentation/doctor-profile/doctorProfile.routes";
import { doctorScheduleRouter } from "./presentation/doctor-schedule/doctorSchedule.routes";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import {
  bookingRouter
} from "./presentation/booking/booking.routes";
import { publicDoctorRouter } from "./presentation/public-doctor/publicDoctor.routes";

import {
visitRouter,
financeVisitRouter,
patientVisitRouter,
treatmentRouter
} from "./presentation/visit/visit.routes";

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Healthcare API is running"
  });
});

app.use("/api/auth", authRouter);

app.use(
  "/api/doctor-profile",
  doctorProfileRouter
);

app.use(
  "/api/doctor-schedules",
  doctorScheduleRouter
);

app.use("/api/bookings", bookingRouter);

app.use("/api/visits", visitRouter);

app.use("/api/finance", financeVisitRouter);

app.use("/api/patients", patientVisitRouter);

app.use("/api/treatments", treatmentRouter);

app.use("/api/doctors", publicDoctorRouter);

app.use(errorMiddleware);
app.use((_request, response) => {
  response.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found"
    }
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
