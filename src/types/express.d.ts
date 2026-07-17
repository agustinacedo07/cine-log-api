// Amplía el tipo Request de Express para que TypeScript sepa que, después
// de pasar por requireAuth, puede llevar un `user` colgado. Es opcional
// (`user?`) porque en rutas SIN requireAuth ese campo no existe.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Este export vacío es necesario para que TypeScript trate este fichero
// como un módulo (y no como un script global suelto) — si no, la
// declaración de arriba puede no aplicarse correctamente.
export {};
