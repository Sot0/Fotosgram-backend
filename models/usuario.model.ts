import { Schema, model, Document } from 'mongoose';
import bycrypt from 'bcrypt';

const usuarioSchema = new Schema({

    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }

});

usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bycrypt.compareSync( password, this.password) ) return true;
    else return false
});

interface IUsuario extends Document {
    avatar?: string;
    email: string;
    nombre: string;
    password: string;

    compararPassword( password: string): boolean;
};

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);