import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../lib/types';
import TaskItem from '../components/TaskItem';
import CreateTaskModal from '../components/CreateTaskModal';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time task events
    socket.on('task-added', (newTask: Task) => {
      setTasks((prev) => [newTask, ...prev]);
    });

    socket.on('task-changed', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    socket.on('task-removed', (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    });

    return () => {
      socket.off('task-added');
      socket.off('task-changed');
      socket.off('task-removed');
    };
  }, [socket]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Task Manager</h1>
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '15px' }}>
                Welcome, {user?.name}!
              </span>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Create Task
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No tasks yet. {isAuthenticated && 'Create one to get started!'}
        </p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdated={fetchTasks} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskList;
