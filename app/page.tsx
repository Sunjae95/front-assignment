import { revalidatePath } from "next/cache";

import styles from "./page.module.scss";
import { PageLayout } from "@/components";
import { TodoList } from "@/components/TodoList";

interface TodoType {
  id: string;
  isSuccess: string;
  title: string;
  content: string;
}

const ENDPOINT = "http://localhost:3001/todoList";

const getTodo = async () => {
  const res = await fetch(`${ENDPOINT}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = (await res.json()) as TodoType[];

  return data.map(({ isSuccess, ...data }) => ({
    ...data,
    isSuccess: isSuccess === "true",
  }));
};

const createTodo = async (data: FormData) => {
  "use server";

  const res = await fetch(`${ENDPOINT}`, {
    method: "POST",
    body: JSON.stringify({
      id: new Date(),
      isSuccess: data.get("isSuccess"),
      title: data.get("title"),
      content: data.get("content"),
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) revalidatePath("/");
};

const updateTodo = async (data: FormData) => {
  "use server";

  const res = await fetch(`${ENDPOINT}/${data.get("id")}`, {
    method: "PUT",
    body: JSON.stringify({
      isSuccess: data.get("isSuccess"),
      title: data.get("title"),
      content: data.get("content"),
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) revalidatePath("/");
};

const deleteTodo = async (data: FormData) => {
  "use server";
  const res = await fetch(`${ENDPOINT}/${data.get("id")}`, {
    method: "DELETE",
  });

  if (res.ok) revalidatePath("/");
};

export default async function Home() {
  const data = await getTodo();

  return (
    <PageLayout>
      <h1 className={styles.title}>TodoList</h1>
      <TodoList
        data={data}
        onCreate={createTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </PageLayout>
  );
}
