import { Schema, model, models, type Document } from "mongoose";

export interface AdminUserDocument extends Document {
  email: string;
  passwordHash: string;
}

const AdminUserSchema = new Schema<AdminUserDocument>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // bcrypt hash, never plaintext
});

// Single-admin model per PRD 6.5 — no roles/permissions in v1.
export const AdminUserModel =
  models.AdminUser || model<AdminUserDocument>("AdminUser", AdminUserSchema);
