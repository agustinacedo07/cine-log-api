# express-basics

Proyecto mínimo para aprender Express con TypeScript: una API REST de
"tareas" (tasks), sin base de datos real — los datos viven en memoria y
se resetean al reiniciar el servidor. El objetivo es centrarse en Express
(rutas, middlewares, manejo de errores), no en una base de datos.

## Arrancar

```bash
npm install
npm run dev
```

Servidor en `http://localhost:3000`.

## Endpoints

| Método | Ruta              | Qué hace                                  |
|--------|-------------------|--------------------------------------------|
| GET    | `/health`         | Comprobación rápida de que el server vive  |
| GET    | `/api/tasks`      | Lista todas las tareas (`?done=true/false` filtra) |
| GET    | `/api/tasks/:id`  | Una tarea por id                           |
| POST   | `/api/tasks`      | Crea una tarea (`{ "title": "..." }`)      |
| PATCH  | `/api/tasks/:id`  | Actualiza `title` y/o `done`               |
| DELETE | `/api/tasks/:id`  | Borra una tarea                            |

Ejemplo rápido:

```bash
curl http://localhost:3000/api/tasks

curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender Express"}'
```

## Estructura

```
src/
  index.ts               → arranca el servidor (app.listen)
  app.ts                 → crea la app y monta middlewares/rutas, en orden
  routes/tasks.routes.ts → qué URL + verbo llama a qué controlador
  controllers/           → la lógica de cada endpoint
  data/tasksStore.ts     → los datos (en memoria); aislado para poder
                            cambiarlo por una base de datos real sin
                            tocar los controllers
  middleware/
    requestLogger.ts      → registra cada petición por consola
    errorHandler.ts       → convierte errores lanzados en respuestas JSON
  utils/HttpError.ts      → error con código de estado HTTP asociado
```

El orden en `app.ts` importa: los middlewares y rutas se ejecutan en el
orden en que se registran con `app.use(...)`, y el `errorHandler` va
siempre el último porque solo atrapa errores de lo registrado antes.

## Por dónde seguir

- Añadir una base de datos real (SQLite con `better-sqlite3` es el salto
  más suave) sustituyendo solo `data/tasksStore.ts`.
- Validación con una librería como `zod` en vez de los `if` manuales en
  los controllers.
- Tests con `supertest` contra los endpoints.
- Variables de entorno con un fichero `.env` (ya se lee `process.env.PORT`
  en `index.ts`, solo falta cargarlo con `dotenv` si quieres un `.env`).
