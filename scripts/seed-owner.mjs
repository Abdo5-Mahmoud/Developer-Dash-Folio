// Creates or updates the single portfolio owner in MongoDB.
// Usage: npm run seed:owner -- owner@example.com "your-password"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";

if (!process.env.MONGODB_URI) {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
      }
    }
  } catch {
    // The missing-URI check below reports the actionable error.
  }
}

const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3];
if (!process.env.MONGODB_URI || !email || !password) {
  console.error(
    'Usage: npm run seed:owner -- owner@example.com "your-password"',
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner"], default: "owner", index: true },
  },
  { timestamps: true },
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { $set: { passwordHash, role: "owner" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(`Owner account seeded for ${email.trim().toLowerCase()}.`);
} catch (error) {
  console.error(
    "Owner seeding failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
