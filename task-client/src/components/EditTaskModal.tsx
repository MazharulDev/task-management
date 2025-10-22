import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../lib/types';
import api from '../lib/api';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
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
      const response = await api.patch(`/tasks/${task.id}`, {
        title,
        body,
      });

      const updatedTask = (response.data as any).data;
      notifyTaskUpdated(updatedTask);
      onTaskUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Task</h2>
        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fee',
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
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="body"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
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
