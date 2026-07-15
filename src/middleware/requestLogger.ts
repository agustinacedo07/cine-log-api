import type { NextFunction, Request, Response } from 'express';

// Un middleware es, literalmente, una función que recibe (req, res, next).
// Express llama a cada middleware en el orden en que se registraron con
// app.use(...). Si no llamas a next(), la petición se queda "atascada"
// aquí para siempre — next() es lo que dice "vale, sigue al siguiente".
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
}
