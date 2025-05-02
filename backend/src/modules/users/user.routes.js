import { Router } from "express";
import { UserController } from "./user.controller.js";

export const userRouter = Router()

userRouter.get('/', UserController.getAll)
userRouter.post('/', UserController.create)