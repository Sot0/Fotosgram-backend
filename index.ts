import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'
import cors from 'cors';
import Server from './classes/server';
import userRoutes from './routes/usuario.routes';
import postRoutes from './routes/post.routes';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({
    extended: true
}));
server.app.use(bodyParser.json());

// Cors
server.app.use(
    cors({
        origin: true,
        credentials: true
    })
);

// File Upload
server.app.use( fileUpload() );
// Línea de abajo resuelve error files 0bytes
// server.app.use( fileUpload({ useTempFiles: true}) );

// Rutas
server.app.use( '/post', postRoutes );
server.app.use( '/user', userRoutes );

// Database
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, error => {
    if(error) throw error;
    console.log('MongoDB connected')
});

server.start(() => console.log(`Server running at port ${server.port}`));
