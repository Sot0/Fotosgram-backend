import jwt from 'jsonwebtoken';
require('dotenv').config();

export default class Token {

    // clave única de la aplicación
    private static seed: string = process.env.JWT_SEED || 'seed-secreto-para-firmar-tokens';
    private static caducidad: string = process.env.JWT_EXPIRED || '1d';

    constructor() {}

    static getJwt( payload: any ): string {
        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }

    static comprobarToken( userToken: string ) {
        return new Promise((resolve, reject) => {
            jwt.verify( userToken, this.seed, ( error, decoded ) => {
                if(error) {
                    // no confiar
                    reject();
                } else {
                    // token válido, decoded = payload data
                    resolve( decoded );
                }
            });
        });
    }

}