export type Task = {
  name: string;
  departments: string[];
  color: string;
  deadline: string;
  createdAt: string;
  done?: boolean;
};

export type Project = {
  id: string | number | undefined;
  name: string;
  description: string;
};
