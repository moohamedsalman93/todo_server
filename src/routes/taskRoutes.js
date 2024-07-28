import express from 'express';
import { addTask, deleteTask, getAllTask, getUserTask, updateTask } from '../controllers/taskController.js';
import { auth } from '../middlewares/auth.js';

const taskRoutes = express.Router();

taskRoutes.post('/tasks', auth, addTask);
taskRoutes.get('/allTasks', auth, getAllTask);
taskRoutes.get('/UserTasks', getUserTask);
taskRoutes.delete('/tasks', deleteTask);
taskRoutes.post('/UpdateTasks', updateTask);

export default taskRoutes;