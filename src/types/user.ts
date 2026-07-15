// Lo que se GUARDA en el almacén. Incluye el hash de la contraseña.
// (En la Fase 1 todavía guardamos el password tal cual, en texto plano,
// a propósito, para centrarnos solo en el CRUD de usuarios. En la Fase 2
// sustituimos "password" por "passwordHash" y añadimos bcrypt.)
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// Lo que se DEVUELVE al cliente. Nunca debe llevar la contraseña (ni el
// hash, cuando lo tengamos), aunque el cliente sea el propio dueño de la
// cuenta. Es buena costumbre tener este tipo separado desde el principio,
// para no arriesgarte a devolver el User completo por descuido en algún
// controller futuro.
export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
}

// Función de conversión User -> PublicUser. Vive aquí, junto al tipo,
// para que cualquier controller que necesite "la versión segura" de un
// usuario la use siempre igual, en vez de reescribir el spread a mano
// cada vez (y arriesgarse a olvidar quitar el password en algún sitio).
export function toPublicUser(user: User): PublicUser {
  const { id, email, createdAt } = user;
  return { id, email, createdAt };
}
