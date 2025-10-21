import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';

const router = express.Router();

// Public route - anyone can view tasks
router.get('/', TaskController.getAllTasks);

router.get('/:id', TaskController.getSingleTask);

// Protected routes - only authenticated users
router.post(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TaskValidation.createTaskZodSchema),
  TaskController.createTask
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TaskValidation.updateTaskZodSchema),
  TaskController.updateTask
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TaskController.deleteTask
);

export const TaskRoutes = router;
