import { Router } from "express";
import {
  createUser,
  getUser,
  listUsers,
} from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", createUser);
