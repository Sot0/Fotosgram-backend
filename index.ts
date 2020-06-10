import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Server from './classes/server';
import userRoutes from './routes/usuario';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({
    extended: true
}));
server.app.use(bodyParser.json());

// Rutas
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
