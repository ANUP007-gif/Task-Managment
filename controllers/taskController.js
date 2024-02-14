const Task = require("../models/taskModel");
const sequelize = require('../dbConnection');


const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const apiFeature = require('../utility/apiFeature');
const { Op } = require('sequelize');

exports.createTask = catchAsync(async (req, res) => {
  req.transaction = await sequelize.transaction();

  try {

    const latestRecord = await Task.findOne({
      order: [['id', 'DESC']],
    });

    if (req.body.display_position) {
      const uniquePosition = await Task.findOne({
        where: {
          display_position: req.body.display_position,
        },
      });

      if (uniquePosition) {
        // Handle the case where a task with the specified display_position already exists
        return res.status(400).json({
          status: 'error',
          message: 'Display position must be unique',
        });
      }
    }


    req.body.display_position = req.body.display_position !== undefined ? req.body.display_position : (latestRecord ? latestRecord.display_position + 1 : 1);

    await Task.create(req.body);
    req.transaction.commit();

    res.status(200).json({
      status: "success",
      message: "Task Adeed  successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });


  }


});


exports.getAllTasks = catchAsync(async (req, res, next) => {
  const { where, limit, order } = apiFeature(req, 'user');

  const Tasks = await Task.findAndCountAll({
    where,
    ...limit,
    order,
    distinct: true,
  });



  res.status(200).json({
    status: 'success',
    data: Tasks.rows,
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await Task.findByPk(id);

  if (!user) {
    return next(new AppError('Task not found', 404));
  }

  res.status(200).json({ status: 'success', data: user });
});

exports.updateTaskStatus = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const updatedUser = await Task.update(req.body, { where: { id } });

  if (!updatedUser) {
    return next(new AppError('Task status not updated', 400));
  }

  res.status(200).json({ status: 'success', message: 'Task status updated successfully' });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  req.transaction = await sequelize.transaction();

  const isTask = await Task.findOne({
    where: {
      id,
    },
  });

  if (!isTask) {
    return next(new AppError('Task not found', 404));
  }




  const deletedTask = await Task.destroy({ where: { id }, transaction: req.transaction });

  if (!deletedTask) {
    return next(new AppError('Task not deleted', 400));
  }

  req.transaction.commit();

  res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
});




exports.changePosition = catchAsync(async (req, res, next) => {
  const { id: taskId } = req.params;
  const { newPosition } = req.body;

  try {
    const taskToMove = await Task.findByPk(taskId);

    if (!taskToMove) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    const oldPosition = taskToMove.display_position;

    // Find the total number of tasks in the list
    const totalTasks = await Task.count();

    // Calculate the display_position for the moved task
    const newPositionInRange = Math.max(1, Math.min(totalTasks, newPosition));

    // Update the position of the moved task in the list
    await Task.update(
      { display_position: newPositionInRange },
      { where: { id: taskId } }
    );

    // Update the positions of other tasks in the same list
    if (oldPosition < newPositionInRange) {
      // Moved down
      await Task.update(
        { display_position: sequelize.literal(`display_position - 1`) },
        {
          where: {
            display_position: {
              [Op.gte]: oldPosition + 1,
              [Op.lt]: newPositionInRange + 1,
            },
            id: { [Op.ne]: taskId },
          },
        }
      );
    } else if (oldPosition > newPositionInRange) {
      await Task.update(
        { display_position: sequelize.literal(`display_position + 1`) },
        {
          where: {
            display_position: {
              [Op.lte]: oldPosition - 1,
              [Op.gt]: newPositionInRange - 1,
            },
            id: { [Op.ne]: taskId },
          },
        }
      );
    }

    res.status(200).json({ status: 'success', message: 'Task moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});