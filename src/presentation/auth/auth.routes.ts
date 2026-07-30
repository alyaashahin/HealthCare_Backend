import { Router } from "express";
import { authController } from "../../infrastructure/dependencies/authDependencies";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
