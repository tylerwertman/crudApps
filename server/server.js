const express = require('express');
const app = express();
const port = 8000;
const socket = require('socket.io');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const Book = require("./models/book.model");

require('dotenv').config();
require('./config/mongoose.config');

app.use(cookieParser())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json(), express.urlencoded({ extended: true }));

require('./routes/user.routes')(app);
require('./routes/idea.routes')(app);
require('./routes/book.routes')(app);

const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log('A client connected.' + socket.id);

    // Handle 'bookAdded' event
    socket.on('bookAdded', (book) => {
        console.log('Book added:', book);
        // Emit the 'bookAdded' event to all connected clients except the sender
        socket.broadcast.emit('bookAdded', book);
    });
    // Handle 'ideaAdded' event
    socket.on('ideaAdded', (newIdea) => {
        console.log('Idea added:', newIdea);
        // Emit the 'ideaAdded' event to all connected clients except the sender
        socket.broadcast.emit('ideaAdded', newIdea);
    });
    // Handle 'ideaFavorited' event
    socket.on('ideaFavorited', (updatedIdea) => {
        console.log('Idea Favorited:', updatedIdea);
        // Emit the 'ideaAdded' event to all connected clients except the sender
        socket.broadcast.emit('ideaFavorited', updatedIdea);
    });
    // Handle 'ideaUnfavorited' event
    socket.on('ideaUnfavorited', (updatedIdea) => {
        console.log('Idea Unfavorited:', updatedIdea);
        // Emit the 'ideaAdded' event to all connected clients except the sender
        socket.broadcast.emit('ideaUnfavorited', updatedIdea);
    });
    // Handle 'ideaDeleted' event
    socket.on('ideaDeleted', (deletedIdea) => {
        console.log('Idea Deleted:', deletedIdea);
        // Emit the 'ideaAdded' event to all connected clients except the sender
        socket.broadcast.emit('ideaDeleted', deletedIdea);
    });


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected.');
    });
});


