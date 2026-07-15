// Un error normal de JS no tiene "código de estado HTTP". Esta clase
// añade ese dato, para que el error handler (ver middleware/errorHandler.ts)
// sepa si debe responder 404, 400, etc. en vez de un genérico 500.
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
