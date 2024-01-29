/// <reference types="react-scripts" />

declare module "Models" {
  type User = {
    id: number;
    name: string;
    email: number;
  };
  type ResponseGetTodos = DataTodos[];
  type ResponsePostTodos = {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
  type ArgsPostTodos = {
    title: string;
    body?: string;
    userId: number;
    completed: boolean;
  };
  type ArgsGetTodos = {
    start?: number | string;
    limit?: number | string;
  };
  type ArgsPatchTodos = {
    id: number;
    title?: string;
    body?: string;
    userId?: number;
    completed?: boolean;
  };
}

type DataTodos = {
  completed: boolean;
  id: number;
  title: string;
};
