const express = require('express');
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/', getAllTasks);      // Get all tasks
router.post('/', createTask);      // Create a new task
router.put('/:id', updateTask);   // Update task status
router.delete('/:id', deleteTask); // Delete a task

module.exports = router;
