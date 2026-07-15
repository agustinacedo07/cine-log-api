import express from "express";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

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

  // Todo lo que llegue a /api/tasks/* lo resuelve tasksRouter.
  // Dentro de tasksRouter, las rutas están declaradas sin el prefijo
  // ("/", "/:id"...) — el prefijo se añade aquí, una sola vez.
  // app.use("/api/tasks", tasksRouter);

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
