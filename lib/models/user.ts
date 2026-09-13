import { Schema, model, models, type Document } from "mongoose";

export type UserRole = "owner";

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
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

export const UserModel = models.User || model<UserDocument>("User", UserSchema);
