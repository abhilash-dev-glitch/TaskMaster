import Task from '../models/taskModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming request
    const { title, description, status, priority, dueDate, labels } = req.body;

    // Input validation
    if (!title) {
      console.log('Validation failed: Title is required');
      return res.status(400).json({ 
        success: false,
        message: 'Title is required',
        field: 'title'
      });
    }

    // Validate status and priority against allowed values
    const allowedStatuses = ['todo', 'in-progress', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
        field: 'status'
      });
    }

    const allowedPriorities = ['low', 'medium', 'high'];
    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Must be one of: ${allowedPriorities.join(', ')}`,
        field: 'priority'
      });
    }

    // Create task object with default values
    const taskData = {
      user: req.user._id,
      title: title.trim(),
      description: (description || '').trim(),
      status: (status || 'todo').toLowerCase(),
      priority: (priority || 'medium').toLowerCase(),
      labels: Array.isArray(labels) ? labels.map(label => label.trim()).filter(Boolean) : []
    };

    // Only add dueDate if it's provided and valid
    if (dueDate) {
      const date = new Date(dueDate);
      if (!isNaN(date.getTime())) {
        taskData.dueDate = date;
      }
    }

    console.log('Creating task with data:', taskData);
    const task = new Task(taskData);

    // Validate the task
    const validationError = task.validateSync();
    if (validationError) {
      console.log('Validation error:', validationError);
      const errors = {};
      Object.keys(validationError.errors).forEach(key => {
        errors[key] = validationError.errors[key].message;
      });
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const createdTask = await task.save();
    console.log('Task created successfully:', createdTask);
    
    res.status(201).json({
      success: true,
      data: createdTask
    });
    
  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sort, search } = req.query;
    const query = { user: req.user._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    const sortOptions = {};
    if (sort === 'dueDate-asc') {
      sortOptions.dueDate = 1;
    } else if (sort === 'dueDate-desc') {
      sortOptions.dueDate = -1;
    } else if (sort === 'priority-asc') {
      sortOptions.priority = 1;
    } else if (sort === 'priority-desc') {
      sortOptions.priority = -1;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest first
    }

    const tasks = await Task.find(query).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, labels } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.labels = labels || task.labels;

      // Update completedAt if task is marked as completed
      if (status === 'completed' && !task.completedAt) {
        task.completedAt = Date.now();
      } else if (status !== 'completed' && task.completedAt) {
        task.completedAt = null;
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (task) {
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task insights
// @route   GET /api/tasks/insights
// @access  Private
const getTaskInsights = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    
    // Tasks by priority
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
    
    // Tasks due soon (within next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const tasksDueSoon = tasks.filter(task => {
      return task.dueDate && task.dueDate <= nextWeek && task.dueDate >= today && task.status !== 'completed';
    }).length;

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      priorityBreakdown: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
      tasksDueSoon,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskInsights,
};
