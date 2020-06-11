import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { IFileUpload } from '../interfaces/file-upload.interface';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

/**Obtener post paginados */
postRoutes.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;

    let skip = pagina -1;
    skip = skip * 10;

    const posts = await Post.find()
                            .populate('usuario', '-password')
                            .skip( skip )
                            .sort({_id: -1})
                            .limit(10)
                            .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
});

/**Crear post */
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const { body } = req;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );
    body.imagenes = imagenes;

    Post.create(body)
        .then( async postDB => {
            await postDB.populate('usuario', '-password').execPopulate();
            
            res.json({
                ok: true,
                post: postDB
            });
        })
        .catch(error => {
            res.json({
                ok: true,
                ...error
            });
        });
});

/**Subir archivos */
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    if( !req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }

    const file: IFileUpload = req.files.imagen;

    if(!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo - imagen'
        });
    }

    if(!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El archivo subido no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );

    res.json({
        ok: true,
        file: file.mimetype
    });
});

/**Obtener una imagen */
postRoutes.get('/imagen/:userId/:img', async (req: any, res: Response) => {
    const {userId, img} = req.params;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
});
export default postRoutes;