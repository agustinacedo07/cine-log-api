// Validación de email muy simple, solo para pillar errores obvios
// ("esto no es un email"). No pretende ser una validación exhaustiva de
// RFC 5322 — para eso, más adelante, una librería como zod.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_REGEX.test(value);
}

export function isValidPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8;
}
