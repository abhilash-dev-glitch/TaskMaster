import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../../api/api';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiFilter, FiSearch, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [error, setError] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await tasksAPI.getTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Delete a task
  const deleteTask = async (id) => {
    if (!id) {
      console.error('Cannot delete task: ID is undefined');
      setError('Cannot delete task: Invalid task ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
        toast.success('Task deleted successfully');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete task';
        setError(errorMessage);
        console.error('Error deleting task:', err);
      }
    }
  };

  // Toggle task completion status
  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    try {
      const { data } = await tasksAPI.updateTask(task._id, {
        ...task,
        status: newStatus
      });
      
      setTasks(tasks.map(t => t._id === task._id ? data.data : t));
      toast.success(`Task marked as ${newStatus === 'completed' ? 'completed' : 'incomplete'}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task status';
      setError(errorMessage);
      console.error('Error updating task status:', err);
    }
  };

  // Filter tasks based on status and search query
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Toggle task details expansion
  const toggleExpandTask = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">My Tasks</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/tasks/add"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> Add New Task
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <FiFilter className="text-gray-500 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {searchQuery 
              ? 'No tasks match your search.' 
              : filter === 'all' 
                ? 'You have no tasks yet. Add one to get started!'
                : `No ${filter} tasks found.`}
          </p>
          {!searchQuery && filter === 'all' && (
            <Link
              to="/tasks/add"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Create your first task
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div 
              key={task._id} 
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`flex-shrink-0 w-5 h-5 mt-1 rounded-full border ${task.status === 'completed' ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'border-gray-300'}`}
                      aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.status === 'completed' && <FiCheck className="text-white w-3 h-3" />}
                    </button>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 
                          className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}
                          onClick={() => toggleExpandTask(task._id)}
                        >
                          {task.title}
                        </h3>
                        <div className="flex space-x-2 ml-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(task.status)}`}>
                            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {(expandedTaskId === task._id || task.description) && (
                        <div className="mt-2 text-gray-600">
                          {task.description || 'No description provided.'}
                        </div>
                      )}
                      
                      <div className="mt-3 text-sm text-gray-500">
                        {task.dueDate && (
                          <div className="flex items-center">
                            <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                            <span>
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <Link
                      to={`/tasks/edit/${task._id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit task"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete task"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
