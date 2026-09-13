import { compare, hash } from "bcryptjs";
const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  const passwordHash = hash(password, SALT_ROUNDS);
  return passwordHash;
}

export function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  const validPassword = compare(password, passwordHash);
  return validPassword;
}
