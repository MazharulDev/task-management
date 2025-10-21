import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { ...taskData } = req.body;

  const result = await TaskService.createTask(userId, taskData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getAllTasks();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TaskService.getSingleTask(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { ...taskData } = req.body;

  const result = await TaskService.updateTask(id, userId, taskData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TaskService.deleteTask(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
