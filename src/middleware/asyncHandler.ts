import type { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

// Express 4 (la versión que usa este proyecto) NO captura automáticamente
// las promesas rechazadas dentro de una ruta `async`. Si un controlador
// async lanza un error (como hace `register` con HttpError) sin este
// envoltorio, la petición se queda colgada en vez de llegar al
// errorHandler y responder con el JSON de error correspondiente.
//
// asyncHandler(fn) devuelve una nueva función que llama a fn(req, res, next)
// y, si la promesa falla, hace next(error) por ti.
export function asyncHandler(fn: AsyncController) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
