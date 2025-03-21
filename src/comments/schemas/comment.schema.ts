import { Schema, Document } from 'mongoose';

export const CommentSchema = new Schema({
  text: { type: String, required: true },
  user: { type: String, required: true }, // Nombre del usuario
  date: { type: Date, default: Date.now }, // Fecha de creación
});

export interface Comment extends Document {
  text: string;
  user: string;
  date: Date;
}