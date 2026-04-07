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
  
  // Protect modifications to admin role
  const { restrictTo } = require('../middlewares/authMiddleware');
  
  router.post('/', restrictTo('admin'), controller.create);
  router.put('/:id', restrictTo('admin'), controller.update);
  router.delete('/:id', restrictTo('admin'), controller.remove);

  return router;
};

module.exports = createCrudRouter;
