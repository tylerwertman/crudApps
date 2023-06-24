const PizzaController = require("../controllers/pizza.controller")

module.exports = app => {
    app.get('/api/pizzas', PizzaController.findAllPizzas)
    app.get('/api/pizzas/:id', PizzaController.findOnePizza)
    app.post('/api/pizzas', PizzaController.createPizza)
    app.post('/api/pizzas/:id/favorite', PizzaController.favorite)
    app.post('/api/pizzas/:id/unfavorite', PizzaController.unfavorite)
    app.put('/api/pizzas/:id', PizzaController.updatePizza)
    app.delete('/api/pizzas/:id', PizzaController.deletePizza)
    app.delete('/api/pizzas/', PizzaController.deleteAllPizzas)
}