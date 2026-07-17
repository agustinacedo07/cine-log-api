import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { usersStore } from "../data/usersStore";
import { toPublicUser } from "../types/user";
import { HttpError } from "../utils/HttpError";
import { isValidEmail, isValidPassword } from "../utils/validators";

import { signToken } from "../utils/jwt";

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

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Aquí SÍ nos limitamos a comprobar que llegan con la forma correcta
  // (son strings, no están vacíos). NO usamos isValidEmail/isValidPassword
  // a rajatabla como "requisito" — si alguien registrado hace tiempo tuviera
  // un email o password que hoy no pasara esas reglas, igualmente debería
  // poder loguearse. Las reglas de formato son para el registro, no para
  // decidir si dejamos intentar un login.
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    throw new HttpError(
      400,
      'Los campos "email" y "password" son obligatorios',
    );
  }

  const user = usersStore.getByEmail(email);

  // Mismo mensaje de error tanto si el email no existe como si la
  // contraseña no coincide. Si distinguiéramos ("ese email no existe" vs
  // "contraseña incorrecta"), cualquiera podría usar el endpoint de login
  // para averiguar qué emails están registrados, probando uno a uno.
  const invalidCredentials = () => new HttpError(401, "Credenciales inválidas");

  if (!user) {
    throw invalidCredentials();
  }

  // bcrypt.compare vuelve a hashear `password` con el mismo salt que
  // lleva incrustado `user.passwordHash`, y compara los resultados.
  // Nunca se "revierte" el hash guardado.
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw invalidCredentials();
  }

  const token = signToken(user.id);
  res.json({ token, user: toPublicUser(user) });
}

export function me(req: Request, res: Response) {
  // req.user debería existir SIEMPRE aquí, porque esta función solo se
  // ejecuta si requireAuth ya dejó pasar la petición (ver auth.routes.ts).
  // Aun así comprobamos explícitamente en vez de usar `req.user!.id` a
  // ciegas: es más robusto ante un futuro cambio de orden de middlewares
  // por error, y TypeScript nos obliga a manejar el caso "undefined" de
  // todos modos porque el tipo es `user?`.
  if (!req.user) {
    throw new HttpError(401, "No autenticado");
  }

  const user = usersStore.getById(req.user.id);
  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.json(toPublicUser(user));
}
