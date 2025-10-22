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
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          flexWrap: 'wrap',
          gap: '15px'
        }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{
            margin: 0,
            color: '#333',
            fontSize: '1.5rem'
          }}>Task Manager</h1>
          <p style={{
            margin: '5px 0 0 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Manage your tasks efficiently
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {isAuthenticated ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                Welcome, {user?.name}!
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                + Create Task
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          color: '#333',
          fontSize: '1.3rem'
        }}>Your Tasks</h2>
        <p style={{
          color: '#666',
          marginTop: '5px',
          fontSize: '0.9rem'
        }}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
        </p>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ddd'
        }}>
          <h3 style={{
            color: '#666',
            marginBottom: '10px',
            fontSize: '1.2rem'
          }}>No tasks yet</h3>
          <p style={{
            color: '#888',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {isAuthenticated
              ? 'Create your first task to get started!'
              : 'Login to create and manage tasks.'}
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              Create Your First Task
            </button>
          )}
        </div>
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