const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const crudControllerFactory = require('../controllers/crudControllerFactory');

const createCrudRouter = (tableName, options = {}) => {
  const router = express.Router();
  const controller = crudControllerFactory(tableName, options);

  // Apply protection to all generic CRUD routes
  router.use(protect);

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  
  // Protect modifications
  router.post('/', restrictTo('admin'), controller.create);
  router.put('/:id', restrictTo('admin'), controller.update);
  router.delete('/:id', restrictTo('admin'), controller.remove);
  
  // Restoration (only for tables with soft delete)
  if (options.softDelete !== false) {
    router.post('/:id/restore', restrictTo('admin'), controller.restore);
  }

  return router;
};

module.exports = createCrudRouter;
