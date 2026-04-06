const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const crudControllerFactory = require('../controllers/crudControllerFactory');

const createCrudRouter = (tableName) => {
  const router = express.Router();
  const controller = crudControllerFactory(tableName);

  // Apply protection to all generic CRUD routes
  router.use(protect);

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};

module.exports = createCrudRouter;
