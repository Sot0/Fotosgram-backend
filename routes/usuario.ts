import { Router, Request, Response } from "express";
import bycrypt from 'bcrypt';
import { Usuario } from '../models/usuario.model';
import Token from '../classes/Token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

/**Login */
userRoutes.post('/login', ( req: Request, res: Response ) => {
    const { email, password } = req.body;

    Usuario.findOne({
        email
    }, ( error, userDB ) => {
        if ( error ) throw error;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contrasaeña incorrectas'
            });
        }

        if( userDB.compararPassword(password) ) {

            const tokenUsuario = Token.getJwt({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUsuario
            })
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña incorrectas'
            })
        }
    });

});

/**Crear usuario */
userRoutes.post('/create', ( req: Request, res: Response ) => {
    const { nombre, email, password, avatar } = req.body;

    const user = {
        nombre,
        email,
        password: bycrypt.hashSync(password, 10),
        avatar
    };

    Usuario.create(user)
        .then(userDB => {
            const tokenUsuario = Token.getJwt({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUsuario
            });
        })
        .catch( error => res.json({
            ok: false,
            error
        }));
});

/**Actualizar usuario */
userRoutes.patch('/actualizar', [verificaToken] ,( req: any, res: Response ) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };

    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, (error, userDB) => {
        if(error) throw error;
        if(!userDB) return res.json({
            ok: false,
            mensaje: 'No existe el usuario'
        });
        // Generar nuevo token
        const {_id, email, avatar} = userDB;
        const token = Token.getJwt({
            _id,
            nombre: userDB.nombre,
            email,
            avatar
        });

        res.json({
            ok: true,
            token
        });
    });
});

export default userRoutes;