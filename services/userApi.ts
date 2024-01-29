"use client";

// import { RootState } from "@/redux/store";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ArgsGetTodos,
  ArgsPatchTodos,
  ArgsPostTodos,
  ResponseGetTodos,
  ResponsePostTodos,
  User,
} from "Models";
import { HYDRATE } from "next-redux-wrapper";

type RootState = any;

function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    getTodos: build.query<ResponseGetTodos, ArgsGetTodos>({
      query: ({ start = 10, limit = 10 }) =>
        `/todos?_start=${start}&_limit=${limit}`,
    }),
    getUsers: build.query<User[], ArgsGetTodos>({
      query: ({ start = 0, limit = 10 }) =>
        `/users?_start=${start}&_limit=${limit}`,
    }),
    getUserByid: build.query<User, { id: string }>({
      query: ({ id }) => `users/${id}`,
    }),

    postTodos: build.mutation<ResponsePostTodos, ArgsPostTodos>({
      query: (initialPost) => ({
        url: "/todos",
        method: "POST",
        body: initialPost,
      }),
    }),
    patchTodos: build.mutation<ResponsePostTodos, ArgsPatchTodos>({
      query: (initialPost) => ({
        url: `/todos/${initialPost.id}`,
        method: "PATCH",
        body: initialPost,
      }),
    }),
    deleteTodos: build.mutation<ResponsePostTodos, { id: number }>({
      query: (initialPost) => ({
        url: `/todos/${initialPost.id}`,
        method: "DELETE",
        body: initialPost,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByidQuery,
  usePostTodosMutation,
  useGetTodosQuery,
  useDeleteTodosMutation,
  usePatchTodosMutation,
  useLazyGetTodosQuery,
} = userApi;
