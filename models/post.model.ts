import { Schema, model } from 'mongoose';
import { IPost } from '../interfaces/post.interface';

const postSchema = new Schema({

    mensaje: {
        type: String,
        required: true
    },
    imagenes: [{
        type: String
    }],
    coords: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    }

}, {timestamps: true});

// postSchema.pre<IPost>('save', function( next ) {
//     this.fechaCreacion = new Date();
//     next();
// });

export const Post = model<IPost>('Post', postSchema);