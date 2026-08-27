import { Schema, model, models, type Document } from "mongoose";
import { MESSAGE_MAX_LENGTH } from "@/features/contact/lib/submit-contact";

export interface ContactMessageDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: {
      type: String,
      required: true,
      maxlength: MESSAGE_MAX_LENGTH,
    },
  },
  { timestamps: true }
);

// `models.ContactMessage ||` guards against Next.js hot-reload redefining the model
export const ContactMessageModel =
  models.ContactMessage ||
  model<ContactMessageDocument>("ContactMessage", ContactMessageSchema);
