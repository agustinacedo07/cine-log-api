import { randomUUID } from "node:crypto";
import type { CreateUserInput, User } from "../types/user.js";

// Mismo patrón que src/data/tasksStore.ts: un array en memoria, aislado
// en su propio módulo para poder sustituirlo por una base de datos real
// más adelante sin tocar controllers ni rutas.
const users: User[] = [];

export const usersStore = {
  getAll(): User[] {
    return users;
  },

  getById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },

  // El email es el identificador natural para login, así que necesitamos
  // poder buscar por él tanto para comprobar duplicados en el registro
  // como para el login en la Fase 3.
  getByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  },

  create(input: CreateUserInput): User {
    const user: User = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },
};
