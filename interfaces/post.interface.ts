import { Document } from 'mongoose';

export interface IPost extends Document {
    mensaje: string;
    imagenes: string[];
    coords: string;
    usuario: string;
};