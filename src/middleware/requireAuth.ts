import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { HttpError } from "../utils/HttpError";

// El cliente manda el token en la cabecera "Authorization", con el
// formato:  Authorization: Bearer <token>
// "Bearer" es solo una palabra convencional que indica el tipo de
// credencial (existen otros esquemas de auth con otras palabras).
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Falta el token de autenticación");
  }

  // "Bearer eyJhbGci..." -> nos quedamos solo con lo que va después del
  // espacio.
  const token = header.slice("Bearer ".length);
  const payload = verifyToken(token);

  if (!payload) {
    throw new HttpError(401, "Token inválido o caducado");
  }

  // Aquí es donde "colgamos" el usuario autenticado en la petición, para
  // que cualquier controller que venga después (ya sea `me` ahora, o
  // `tasks` en la Fase 5) sepa quién está haciendo la petición sin tener
  // que volver a leer el token.
  req.user = { id: payload.sub };

  next();
}
