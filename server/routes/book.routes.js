const BookController = require("../controllers/book.controller")

module.exports = app => {
    app.get('/api/books', BookController.findAllBooks)
    app.get('/api/books/:id', BookController.findOneBook)
    app.post('/api/books', BookController.createBook)
    app.post('/api/books/:id/favorite', BookController.favorite)
    app.post('/api/books/:id/unfavorite', BookController.unfavorite)
    app.put('/api/books/:id', BookController.updateBook)
    app.delete('/api/books/:id', BookController.deleteBook)
    app.delete('/api/books/', BookController.deleteAllBooks)
}