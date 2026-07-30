import "dotenv/config";

import express from "express";
import cors from "cors";

import { authRouter } from "./presentation/auth/auth.routes";
import { doctorProfileRouter } from "./presentation/doctor-profile/doctorProfile.routes";
import { doctorScheduleRouter } from "./presentation/doctor-schedule/doctorSchedule.routes";


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
  "/api/doctor-profiles",
  doctorProfileRouter
);

app.use(
  "/api/doctor-schedules",
  doctorScheduleRouter
);

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
