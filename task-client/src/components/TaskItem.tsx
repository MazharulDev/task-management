import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { Task } from '../lib/types';
import api from '../lib/api';
import EditTaskModal from './EditTaskModal';
import ConfirmModal from './ConfirmModal';

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

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { locks, notifyTaskDeleted } = useSocket();

  // Memoize lock state to prevent blinking
  const lock = useMemo(() => locks.get(task.id), [locks, task.id]);
  const isLockedByOther = useMemo(
    () => lock && lock.userId !== user?.id,
    [lock, user?.id]
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/tasks/${task.id}`);
      notifyTaskDeleted(task.id);
      onTaskUpdated();
      setShowDeleteConfirm(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const message =
        axiosError.response?.data?.errorMessages?.[0]?.message ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to delete task';

      setDeleteError(message);
      // Don't close the modal if there's an error
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
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        <div style={{ flex: 1, width: '100%' }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '1.1rem'
          }}>{task.title}</h3>
          <p style={{
            margin: '0 0 10px 0',
            color: '#555',
            fontSize: '0.9rem'
          }}>{task.body}</p>
          <div style={{
            fontSize: '0.8rem',
            color: '#888',
            marginTop: '10px'
          }}>
            {task.editor && (
              <div>Last edited by: {task.editor.name}</div>
            )}
            <div>
              Updated: {new Date(task.updatedAt).toLocaleString()}
            </div>
            {lock && (
              <div style={{
                color: '#dc3545',
                fontWeight: 'bold',
                marginTop: '5px'
              }}>
                🔒 Currently being edited by {lock.userName}
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div style={{
            display: 'flex',
            gap: '10px',
            width: '100%',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isLockedByOther}
              style={{
                padding: '8px 16px',
                backgroundColor: isLockedByOther ? '#ccc' : '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLockedByOther ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: '1',
                maxWidth: '100px'
              }}
              title={isLockedByOther ? `Locked by ${lock?.userName}` : 'Edit task'}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isLockedByOther}
              style={{
                padding: '8px 16px',
                backgroundColor: isLockedByOther ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (isDeleting || isLockedByOther) ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: '1',
                maxWidth: '100px'
              }}
              title={isLockedByOther ? `Locked by ${lock?.userName}` : 'Delete task'}
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteError('');
        }}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDeleting={isDeleting}
      />

      {deleteError && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {deleteError}
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskItem);