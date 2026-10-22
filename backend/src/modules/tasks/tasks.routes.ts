import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.ts";
import * as tasksController from "./tasks.controller.ts";

export const tasksRouter = Router();

tasksRouter.use(authenticate);
tasksRouter.get("/", tasksController.list);
tasksRouter.get("/:id", tasksController.getById);
tasksRouter.post("/", tasksController.create);
tasksRouter.patch("/:id", tasksController.update);
tasksRouter.delete("/:id", tasksController.remove);
