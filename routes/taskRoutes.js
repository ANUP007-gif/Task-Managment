const express = require('express');
const { validator, validateResponse } = require('../utility/validator');
const taskController = require('../controllers/taskController');




const router = express.Router();

router.post('/', ...validator.CreateTask, validateResponse, taskController.createTask);

router
  .route('/')
  .get(
    taskController.getAllTasks
  );

router
  .route('/:id')
  .get(
  
    taskController.getTask
  )
  .delete(
    taskController.deleteTask
  );


  router.post(
    '/changePosition/:id',
    validateResponse,
    taskController.changePosition
  );
  

  router.patch(
    '/:id',
    ...validator.updateTaskStatus,
    taskController.updateTaskStatus
  )
module.exports = router;
