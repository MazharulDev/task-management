import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Task, TaskLock } from '../lib/types';

interface SocketContextType {
  socket: Socket | null;
  locks: Map<string, TaskLock>;
  lockTask: (taskId: string, userId: string, userName: string) => void;
  unlockTask: (taskId: string, userId: string) => void;
  notifyTaskCreated: (task: Task) => void;
  notifyTaskUpdated: (task: Task) => void;
  notifyTaskDeleted: (taskId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [locks, setLocks] = useState<Map<string, TaskLock>>(new Map());

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    // Listen for initial locks
    newSocket.on('initial-locks', (initialLocks: Record<string, TaskLock>) => {
      setLocks(new Map(Object.entries(initialLocks)));
    });

    // Listen for task locked event
    newSocket.on('task-locked', ({ taskId, userId, userName }) => {
      setLocks((prev) => {
        const newLocks = new Map(prev);
        newLocks.set(taskId, { userId, userName, socketId: '' });
        return newLocks;
      });
    });

    // Listen for task unlocked event
    newSocket.on('task-unlocked', ({ taskId }) => {
      setLocks((prev) => {
        const newLocks = new Map(prev);
        newLocks.delete(taskId);
        return newLocks;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const lockTask = (taskId: string, userId: string, userName: string) => {
    if (socket) {
      socket.emit('lock-task', { taskId, userId, userName });
    }
  };

  const unlockTask = (taskId: string, userId: string) => {
    if (socket) {
      socket.emit('unlock-task', { taskId, userId });
    }
  };

  const notifyTaskCreated = (task: Task) => {
    if (socket) {
      socket.emit('task-created', task);
    }
  };

  const notifyTaskUpdated = (task: Task) => {
    if (socket) {
      socket.emit('task-updated', task);
    }
  };

  const notifyTaskDeleted = (taskId: string) => {
    if (socket) {
      socket.emit('task-deleted', taskId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        locks,
        lockTask,
        unlockTask,
        notifyTaskCreated,
        notifyTaskUpdated,
        notifyTaskDeleted,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

