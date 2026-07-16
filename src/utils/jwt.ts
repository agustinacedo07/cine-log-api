import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

// Lo único que metemos DENTRO del token es el id del usuario. Un JWT no
// es secreto ni está cifrado: cualquiera que lo tenga puede leer su
// contenido (pruébalo en https://jwt.io pegando un token). Lo que
// garantiza la firma NO es que el contenido sea privado, sino que nadie
// pueda modificarlo sin que la verificación falle. Por eso nunca metemos
// aquí el email, el password ni nada sensible.
export interface JwtPayload {
  sub: string; // "subject": el id del usuario. Es el nombre estándar de este claim.
}

export function signToken(userId: string): string {
  const payload: JwtPayload = { sub: userId };
  // jsonwebtoken tipa `expiresIn` de forma muy estricta (solo acepta
  // strings con un formato concreto, tipo "1h", "7d"). Como el valor viene
  // de una variable de entorno (un string libre que nosotros controlamos
  // en .env), hacemos un cast explícito en vez de complicar el tipo de
  // `env.jwtExpiresIn` — si escribes algo con un formato inválido en el
  // .env, jsonwebtoken lo detectará en tiempo de ejecución al firmar.
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

// Devuelve el payload si el token es válido, o null si no lo es (firma
// incorrecta, caducado, o mal formado). Centralizar esto aquí evita tener
// try/catch de jsonwebtoken repartidos por los controllers/middleware.
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}
