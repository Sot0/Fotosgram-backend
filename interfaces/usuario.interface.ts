import { Document } from 'mongoose';

export interface IUsuario extends Document {
    avatar?: string;
    email: string;
    nombre: string;
    password: string;

    compararPassword( password: string): boolean;
};