import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./presentation/auth/auth.routes";
import { doctorProfileRouter } from "./presentation/doctor-profile/doctorProfile.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", authRouter);

app.use("/api/doctor-profiles", doctorProfileRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});