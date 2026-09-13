import jwt from "jsonwebtoken";

const SESSION_DURATION = "8h";

export function createJwt(user: { id: string; email: string; role: "owner" }) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET environment variable");

  return jwt.sign(
    {
      email: user.email.trim().toLowerCase(),
      userId: user.id,
      role: user.role,
    },
    secret,
    { algorithm: "HS256", expiresIn: SESSION_DURATION },
  );
}
