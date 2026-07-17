import "dotenv/config";

// Centralizamos aquí la lectura de process.env. Si falta algo
// obligatorio, fallamos AHORA (al arrancar el servidor) con un mensaje
// claro, en vez de que reviente más tarde a mitad de una petición de
// login con un error críptico de jsonwebtoken.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno "${name}". Copia .env.example a .env y rellénala.`,
    );
  }
  return value;
}

export const env = {
  port: process.env.PORT ?? "3000",
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};
