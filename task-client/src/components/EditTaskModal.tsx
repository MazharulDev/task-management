import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../lib/types';
import api from '../lib/api';

// Define the error structure
interface AxiosError {
  response?: {
    data?: {
      message?: string;
      errorMessages?: { message?: string }[];
    };
  };
  message?: string;
}

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

// Define the response structure
interface ApiResponse {
  data: Task;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onClose,
  onTaskUpdated,
}) => {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { lockTask, unlockTask, notifyTaskUpdated, locks } = useSocket();

  useEffect(() => {
    if (user) {
      // Try to lock the task when modal opens
      lockTask(task.id, user.id, user.name);
    }

    return () => {
      // Unlock when modal closes
      if (user) {
        unlockTask(task.id, user.id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount/unmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if task is locked by another user
    const lock = locks.get(task.id);
    if (lock && lock.userId !== user?.id) {
      setError(`This task is being edited by ${lock.userName}`);
      setLoading(false);
      return;
    }

    try {
      const response = await api.patch<ApiResponse>(`/tasks/${task.id}`, {
        title,
        body,
      });

      const updatedTask = response.data.data;
      notifyTaskUpdated(updatedTask);
      onTaskUpdated();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError;
      const message =
        axiosError.response?.data?.errorMessages?.[0]?.message ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to update task';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Check if task is locked by another user
  const lock = locks.get(task.id);
  const isLockedByOther = lock && lock.userId !== user?.id;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{
          marginTop: 0,
          fontSize: '1.5rem'
        }}>Edit Task</h2>
        {isLockedByOther && (
          <div
            style={{
              color: 'white',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#dc3545',
              borderRadius: '4px',
            }}
          >
            🔒 This task is currently being edited by {lock?.userName}
          </div>
        )}
        {error && (
          <div
            style={{
              color: 'white',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#dc3545',
              borderRadius: '4px',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '0.9rem'
              }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLockedByOther}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: isLockedByOther ? '#f8f9fa' : 'white'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="body"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '0.9rem'
              }}
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              disabled={isLockedByOther}
              rows={5}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: isLockedByOther ? '#f8f9fa' : 'white'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1',
                minWidth: '100px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isLockedByOther}
              style={{
                padding: '8px 16px',
                backgroundColor: isLockedByOther ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || isLockedByOther) ? 'not-allowed' : 'pointer',
                flex: '1',
                minWidth: '100px'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;