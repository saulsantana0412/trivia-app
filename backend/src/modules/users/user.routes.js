import { Router } from "express";
import { UserController } from "./user.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const UserRouter = Router()

UserRouter.get('/', catchAsync(UserController.getAll))