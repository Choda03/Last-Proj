import mongoose, { Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const contactMessageSchema = new mongoose.Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema); 