"use client";

import store from "@/redux/store";
import { usePostTodosMutation, userApi } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

// export async function getServerSideProps(context: any) {
//   const params = context.params;
//   await store.dispatch(
//     userApi.endpoints.getTodos.initiate({ start: parseInt(params.start) })
//   );
//   const queries = store.getState().userApi.queries;
//   const todos = queries[`getTodos({"start":${params.start}})`];
//   return {
//     props: {
//       todos: todos,
//     },
//   };
// }

export const getStaticPaths = async () => {
  let paths = [
    {
      params: {
        page: "1",
        start: "0",
      },
    },
  ];
  for (let i = 0; i < 100; i++) {
    let last = paths[paths.length - 1],
      start = parseInt(last.params.start) + 10,
      page = parseInt(last.params.page) + 1;
    paths = [
      ...paths,
      {
        params: {
          start: start.toString(),
          page: page.toString(),
        },
      },
    ];
  }

  return {
    paths: paths,
    fallback: true, // false or "blocking"
  };
};

export async function getStaticProps(context: any) {
  const params = context.params;
  await store.dispatch(
    userApi.endpoints.getTodos.initiate({ start: parseInt(params.start) })
  );
  const queries = store.getState().userApi.queries;
  const todos = queries[`getTodos({"start":${params.start}})`];
  return {
    props: {
      todos: todos,
      params,
    },
    revalidate: 60,
  };
}

export default function Home({ todos, params }: any) {
  // const params = useParams() as { page: string; start: string };
  const [page, setPage] = useState<number>(parseInt(params.page));
  const [start, setStart] = useState<number>(parseInt(params.start));

  const [postTodos] = usePostTodosMutation();
  const [newTodos, setNewTodos] = useState("");

  const handleDelteTodos = (id: number) => {};

  const handlePostTodos = () => {
    postTodos({
      title: newTodos,
      completed: false,
      userId: Math.random() * 100,
    }).then((res) => {
      alert("tugas baru telah dibuat!");
    });
  };

  const route = useRouter();

  const handlePaging = (paging: "next" | "prev") => {
    console.log("todos.data", todos.data);
    if ((todos.data?.length !== 0 || paging === "prev") && !todos.isLoading) {
      setStart((start) => {
        if (paging === "next") {
          route.push(`/${page + 1}/${start + 10}`);
          setPage(page + 1);
          return start + 10;
        } else {
          if (page !== 1) {
            route.push(`/${page - 1}/${start - 10}`);

            setPage(page - 1);
          }

          if (start > 0) {
            return start - 10;
          } else {
            return start;
          }
        }
      });
    }
  };

  if (todos.isLoading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6 text-white"
        >
          Todos
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            onChange={(e) => setNewTodos(e.target.value)}
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="type new todo"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={() => {
                handlePostTodos();
              }}
              className="text-black mr-2"
            >
              Create
            </button>
          </div>
        </div>
      </div>
      {!todos.isLoading && (
        <table
          className="table-auto border-collapse border border-slate-500 min-h-96"
          style={{
            minWidth: "70%",
            height: "100%",
          }}
        >
          <thead>
            <tr>
              <th className="border border-slate-600">NO</th>
              <th className="border border-slate-600">title</th>
            </tr>
          </thead>
          <tbody>
            {todos.data?.map((data: DataTodos) => {
              return (
                <tr key={data.id}>
                  <td className="border border-slate-700 text-center">
                    {data.id}
                  </td>
                  <td className="border border-slate-700">{data.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="justify-between text-xl font-medium self-center">
        <button
          onClick={() => handlePaging("prev")}
          className="bg-white text-black rounded-md p-1 "
        >
          {"prev"}
        </button>
        <span className="px-2">{page}</span>
        <button
          onClick={() => handlePaging("next")}
          className="bg-white text-black rounded-md p-1 "
        >
          {"next"}
        </button>
      </div>
    </main>
  );
}
