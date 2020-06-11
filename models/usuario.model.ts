import { Schema, model } from 'mongoose';
import bycrypt from 'bcrypt';
import { IUsuario } from '../interfaces/usuario.interface';

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

}, {timestamps: true});

usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bycrypt.compareSync( password, this.password) ) return true;
    else return false
});

export const Usuario = model<IUsuario>('Usuarios', usuarioSchema);