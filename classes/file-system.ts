import { IFileUpload } from '../interfaces/file-upload.interface';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    
    constructor() { };

    guardarImagenTemporal( file: IFileUpload, userId: string ) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.crearCarpetaUsuario( userId );
    
            // Nombre del archivo
            const nombreArchivo = this.generarNombreUnico( file.name );
            
            // Mover archivo físico del temp al fodler del usuario
            file.mv(`${path}/${nombreArchivo}`, (error:any) => {
                if(error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private crearCarpetaUsuario( userId: string ) {
        const pathUser = path.resolve( __dirname, '../filesUpload', userId );
        const pathUserTemp = pathUser + '/temp';
        const existe = fs.existsSync(pathUser);
        if(!existe) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }
        return pathUserTemp;
    }

    private generarNombreUnico( nombreOriginal: string ) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length -1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`;
    }

    imagenesDeTempHaciaPost( userId: string ) {
        const pathUserTemp = path.resolve( __dirname, '../filesUpload', userId, 'temp' );
        const pathUserPost = path.resolve( __dirname, '../filesUpload', userId, 'posts' );

        if(!fs.existsSync(pathUserTemp)) {
            return [];
        }
        if(!fs.existsSync(pathUserPost)) {
            fs.mkdirSync(pathUserPost);
        }
        // leer imagenes de la carpeta temp
        const imagenesTemp = this.obtenerImagenesEnTemp( userId );
        // mover las imagenes
        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
        });
        return imagenesTemp;
    }

    private obtenerImagenesEnTemp( userId: string ) {
        const pathUserTemp =  path.resolve( __dirname, '../filesUpload', userId, 'temp' );
        return fs.readdirSync(pathUserTemp) || [];
    }

    getFotoUrl( userId: string, img: string) {
        // Path archivos en posts
        const pathFoto = path.resolve( __dirname, '../filesUpload', userId, 'posts', img );
        // Verificar si la imagen existe
        if(!fs.existsSync(pathFoto)) return path.resolve( __dirname, '../assets/400x250.jpg');
        return pathFoto;
    }

};