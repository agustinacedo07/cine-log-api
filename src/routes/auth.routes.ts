import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../middleware/asyncHandler";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
// requireAuth va ANTES que `me`: si el token no es válido, ni siquiera
// llega a ejecutarse `me`.
authRouter.get("/me", requireAuth, me);
