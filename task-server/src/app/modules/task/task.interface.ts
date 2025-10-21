export type ITask = {
  id: string;
  title: string;
  body: string;
  lastEditedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateTask = {
  title: string;
  body: string;
};

export type IUpdateTask = {
  title?: string;
  body?: string;
};
