import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../lib/types';
import api from '../lib/api';
import EditTaskModal from './EditTaskModal';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { locks, notifyTaskDeleted } = useSocket();

  const lock = locks.get(task.id);
  const isLockedByOther = lock && lock.userId !== user?.id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      notifyTaskDeleted(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: isLockedByOther ? '#f8f9fa' : 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
          <p style={{ margin: '0 0 10px 0', color: '#555' }}>{task.body}</p>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {task.editor && (
              <div>Last edited by: {task.editor.name}</div>
            )}
            <div>
              Updated: {new Date(task.updatedAt).toLocaleString()}
            </div>
            {lock && (
              <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                🔒 Currently being edited by {lock.userName}
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isLockedByOther}
              style={{
                padding: '6px 12px',
                backgroundColor: isLockedByOther ? '#ccc' : '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLockedByOther ? 'not-allowed' : 'pointer',
              }}
              title={isLockedByOther ? `Locked by ${lock?.userName}` : 'Edit task'}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </div>
  );
};

export default TaskItem;
