import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { TaskRoutes } from '../modules/task/task.routes';
import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/tasks',
    route: TaskRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
