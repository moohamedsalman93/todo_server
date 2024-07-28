import { Types } from 'mongoose';
import Task from '../models/Task.js';


const addTask = async (req, res) => {
  const { title, description, assignedTo, status, priority } = req.body;

  try {

    const task = new Task({
      title,
      description,
      assignedTo: assignedTo ? assignedTo : null,
      status,
      priority
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTask = async (req, res) => {
  const { q } = req.query;

  try {
    let query = {};

    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const AllTasks = await Task.find(query).populate('assignedTo');
    res.json(AllTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserTask = async (req, res) => {
  const { UserId } = req.query;

  try {
    const query = { assignedTo: UserId };

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const statusOrder = { 0: 1, 1: 2, 2: 3 };

    const AllTasks = await Task.find(query).sort({ priority: 1 }).populate('assignedTo');

    AllTasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });


    res.json(AllTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteTask = async (req, res) => {
  const { taskId } = req.query;
  console.log(taskId)
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateTask = async (req, res) => {
  const { taskId } = req.query;
  const { status, title, description, priority, assignedTo } = req.body;

  try {
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (assignedTo !== undefined) {
      updateFields.assignedTo = assignedTo;
    }
    else {
      updateFields.assignedTo = null
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addTask, deleteTask, updateTask };
