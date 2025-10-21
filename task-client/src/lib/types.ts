export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  body: string;
  lastEditedBy: string | null;
  editor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskLock {
  userId: string;
  userName: string;
  socketId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}
