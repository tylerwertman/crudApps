const express = require('express')
const app = express()
const socket = require('socket.io')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = 8000

require('dotenv').config()
require('./server/config/mongoose.config')

app.use(cookieParser())
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://crudapps.tylerw.xyz'] }))
app.use(express.json(), express.urlencoded({ extended: true }))

require('./server/routes/user.routes')(app)
require('./server/routes/idea.routes')(app)
require('./server/routes/book.routes')(app)
require('./server/routes/pizza.routes')(app)
require("./server/routes/upload.routes")(app)

app.use(express.static("public"))

const server = app.listen(port, () => console.log(`Listening on port: port`))

const io = socket(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://crudapps.tylerw.xyz'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
})

io.on('connection', (socket) => {
    console.log('A client connected.' + socket.id)

    // Handle 'bookAdded' event
    socket.on('bookAdded', (newBook) => {
        console.log('Book added:', newBook)
        socket.broadcast.emit('bookAdded', newBook)
    })
    // Handle 'bookDeleted' event
    socket.on('bookDeleted', (deletedBook) => {
        console.log('Book Deleted:', deletedBook)
        socket.broadcast.emit('bookDeleted', deletedBook)
    })

    // Handle 'ideaAdded' event
    socket.on('ideaAdded', (newIdea) => {
        console.log('Idea added:', newIdea)
        socket.broadcast.emit('ideaAdded', newIdea)
    })
    // Handle 'ideaFavorited' event
    socket.on('ideaFavorited', (updatedIdea) => {
        console.log('Idea Favorited:', updatedIdea)
        socket.broadcast.emit('ideaFavorited', updatedIdea)
    })
    // Handle 'ideaUnfavorited' event
    socket.on('ideaUnfavorited', (updatedIdea) => {
        console.log('Idea Unfavorited:', updatedIdea)
        socket.broadcast.emit('ideaUnfavorited', updatedIdea)
    })
    // Handle 'ideaDeleted' event
    socket.on('ideaDeleted', (deletedIdea) => {
        console.log('Idea Deleted:', deletedIdea)
        socket.broadcast.emit('ideaDeleted', deletedIdea)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected.')
    })
})


