import type { Request, Response } from "express";
import { usersStore } from "../data/usersStore";
import { toPublicUser } from "../types/user";
import { HttpError } from "../utils/HttpError";

// Validación de email muy simple, solo para pillar errores obvios
// ("no es un email"). No pretende ser una validación exhaustiva de RFC.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// IMPORTANTE: este controller es temporal y solo para la Fase 1. Expone
// /api/users sin ninguna protección, y en createUser el password todavía
// se guarda en texto plano (a propósito, para aislar "aprender el CRUD
// de usuarios" de "aprender bcrypt", que llega en la Fase 2). No uses
// este endpoint tal cual en un proyecto real.

export function listUsers(_req: Request, res: Response) {
  // .map(toPublicUser): nunca devolvemos el array de `users` tal cual,
  // porque cada User lleva el campo `password`.
  res.json(usersStore.getAll().map(toPublicUser));
}

export function getUser(req: Request, res: Response) {
  const user = usersStore.getById(req.params.id);
  if (!user)
    throw new HttpError(
      404,
      `No existe ningún usuario con id ${req.params.id}`,
    );
  res.json(toPublicUser(user));
}
