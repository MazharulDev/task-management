import { Task } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICreateTask, IUpdateTask } from './task.interface';

const createTask = async (
  userId: string,
  payload: ICreateTask
): Promise<Task> => {
  const result = await prisma.task.create({
    data: {
      ...payload,
      lastEditedBy: userId,
    },
    include: {
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllTasks = async (): Promise<Task[]> => {
  const result = await prisma.task.findMany({
    include: {
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return result;
};

const getSingleTask = async (id: string): Promise<Task | null> => {
  const result = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return result;
};

const updateTask = async (
  id: string,
  userId: string,
  payload: IUpdateTask
): Promise<Task> => {
  const isExist = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const result = await prisma.task.update({
    where: {
      id,
    },
    data: {
      ...payload,
      lastEditedBy: userId,
    },
    include: {
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deleteTask = async (id: string): Promise<Task> => {
  const isExist = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const result = await prisma.task.delete({
    where: {
      id,
    },
  });

  return result;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
