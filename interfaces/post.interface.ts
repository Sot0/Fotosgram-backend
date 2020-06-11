import { Document } from 'mongoose';

export interface IPost extends Document {
    fechaCreacion: Date;
    mensaje: string;
    imagenes: string[];
    coords: string;
    usuario: string;
};