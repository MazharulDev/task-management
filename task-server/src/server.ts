import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';
import { initializeSocketIO } from './socket';


async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
  });

  initializeSocketIO(io);
  logger.info('Socket.IO initialized');

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorlogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
