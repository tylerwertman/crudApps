const IdeaController = require("../controllers/idea.controller")

module.exports = app => {
    app.get('/api/ideas', IdeaController.findAllIdeas)
    app.get('/api/ideas/:id', IdeaController.findOneIdea)
    app.post('/api/ideas', IdeaController.createIdea)
    app.post('/api/ideas/:id/favorite', IdeaController.favorite)
    app.post('/api/ideas/:id/unfavorite', IdeaController.unfavorite)
    app.put('/api/ideas/:id', IdeaController.updateIdea)
    app.delete('/api/ideas/:id', IdeaController.deleteIdea)
    app.delete('/api/ideas/', IdeaController.deleteAllIdeas)
}