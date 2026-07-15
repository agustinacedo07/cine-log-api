import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { usersStore } from "../data/usersStore";
import { toPublicUser } from "../types/user";
import { HttpError } from "../utils/HttpError";
import { isValidEmail, isValidPassword } from "../utils/validators";

// Coste del hash: cuántas "rondas" aplica bcrypt. Más alto = más lento de
// calcular = más caro de atacar por fuerza bruta, pero también más lento
// para ti en cada login. 10-12 es el rango habitual hoy en día.
const BCRYPT_SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    throw new HttpError(
      400,
      'El campo "email" es obligatorio y debe tener formato de email',
    );
  }
  if (!isValidPassword(password)) {
    throw new HttpError(
      400,
      'El campo "password" es obligatorio y debe tener al menos 8 caracteres',
    );
  }
  if (usersStore.getByEmail(email)) {
    // Aquí SÍ es correcto decir explícitamente "email duplicado": todavía
    // no estamos en el login, no hay riesgo de revelar quién tiene cuenta
    // de forma explotable de la misma manera (el propio registro ya
    // implica que ese email no es secreto).
    throw new HttpError(409, "Ya existe un usuario con ese email");
  }

  // bcrypt.hash es asíncrono a propósito: calcular el hash es una
  // operación cara en CPU, y hacerla de forma síncrona bloquearía el
  // event loop de Node para TODAS las peticiones mientras se calcula.
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = usersStore.create({ email, passwordHash });
  res.status(201).json(toPublicUser(user));
}
