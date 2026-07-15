import express from "express";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

import { usersRouter } from "./routes/users.router";
import { authRouter } from "./routes/auth.routes";

export function createApp() {
  const app = express();

  // Middlewares globales: se ejecutan para TODAS las peticiones, en el
  // orden en que se registran aquí.
  app.use(requestLogger); // 1. registra la petición
  app.use(express.json()); // 2. parsea el body JSON a req.body

  // Ruta de comprobación rápida, útil para verificar que el server está vivo.
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  //APIs
  /** Usuarios */
  app.use("/api/users", usersRouter);

  /** Autenticación */
  app.use("/api/auth", authRouter);

  // Middleware para rutas que no coinciden con nada anterior (404).
  app.use((req, res) => {
    res
      .status(404)
      .json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
  });

  // El manejador de errores SIEMPRE va el último: solo atrapa errores
  // lanzados en algo registrado antes que él.
  app.use(errorHandler);

  return app;
}
