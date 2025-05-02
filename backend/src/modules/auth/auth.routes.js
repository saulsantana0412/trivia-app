import { Router } from "express";
import { AuthController } from "./auth.controller.js";

export const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/refresh_token', AuthController.refreshToken)