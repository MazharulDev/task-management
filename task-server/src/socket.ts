import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from './shared/logger';

// Store task locks: { taskId: { userId, userName, socketId } }
export const taskLocks = new Map<
  string,
  { userId: string; userName: string; socketId: string }
>();

export const initializeSocketIO = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Send current locks to new client
    socket.emit('initial-locks', Object.fromEntries(taskLocks));

    // Handle task lock request
    socket.on(
      'lock-task',
      (data: { taskId: string; userId: string; userName: string }) => {
        const { taskId, userId, userName } = data;

        // Check if task is already locked
        const existingLock = taskLocks.get(taskId);

        if (existingLock && existingLock.userId !== userId) {
          // Task is locked by another user
          socket.emit('lock-failed', {
            taskId,
            lockedBy: existingLock.userName,
          });
          return;
        }

        // Lock the task
        taskLocks.set(taskId, { userId, userName, socketId: socket.id });

        // Broadcast to all clients that task is locked
        io.emit('task-locked', { taskId, userId, userName });

        logger.info(`Task ${taskId} locked by ${userName}`);
      }
    );

    // Handle task unlock request
    socket.on('unlock-task', (data: { taskId: string; userId: string }) => {
      const { taskId, userId } = data;

      const existingLock = taskLocks.get(taskId);

      // Only the user who locked can unlock
      if (existingLock && existingLock.userId === userId) {
        taskLocks.delete(taskId);

        // Broadcast to all clients that task is unlocked
        io.emit('task-unlocked', { taskId });

        logger.info(`Task ${taskId} unlocked`);
      }
    });

    // Handle task update broadcast
    socket.on('task-updated', (task: any) => {
      // Broadcast to all clients that a task was updated
      io.emit('task-changed', task);
      logger.info(`Task ${task.id} updated`);
    });

    // Handle task creation broadcast
    socket.on('task-created', (task: any) => {
      // Broadcast to all clients that a task was created
      io.emit('task-added', task);
      logger.info(`Task ${task.id} created`);
    });

    // Handle task deletion broadcast
    socket.on('task-deleted', (taskId: string) => {
      // Broadcast to all clients that a task was deleted
      io.emit('task-removed', taskId);

      // Remove lock if exists
      taskLocks.delete(taskId);

      logger.info(`Task ${taskId} deleted`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);

      // Release all locks held by this socket
      for (const [taskId, lock] of taskLocks.entries()) {
        if (lock.socketId === socket.id) {
          taskLocks.delete(taskId);
          io.emit('task-unlocked', { taskId });
          logger.info(`Task ${taskId} unlocked due to disconnect`);
        }
      }
    });
  });
};