// Generates a Node scrypt hash for ADMIN_PASSWORD_HASH:
// scrypt$N$r$p$base64url-salt$base64url-derived-key
// Usage: npm run hash:admin-password -- <password>
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash:admin-password -- <password>");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const salt = randomBytes(16);
const derivedKey = scryptSync(password, salt, 32, { N, r, p });

console.log(
  `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`
);
