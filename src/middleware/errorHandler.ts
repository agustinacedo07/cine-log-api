import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/HttpError';

// Un middleware con CUATRO argumentos (err, req, res, next) es especial:
// Express lo reconoce como "manejador de errores" y solo lo llama cuando
// algo dentro de la cadena hace next(error) o lanza una excepción dentro
// de una ruta async envuelta correctamente (ver asyncHandler.ts).
//
// Se registra el ÚLTIMO en app.ts, porque solo atrapa errores de lo que
// esté declarado ANTES que él.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
