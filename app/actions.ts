"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

interface TodoType {
  id: string;
  isSuccess: string;
  title: string;
  content: string;
}

const ENDPOINT = "http://localhost:3001/todoList";
const headers = { "Content-Type": "application/json" };

export const getTodoList = async () => {
  const res = await fetch(`${ENDPOINT}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (res.ok) {
    const data = (await res.json()) as TodoType[];

    return data.map(({ isSuccess, ...data }) => ({
      ...data,
      isSuccess: isSuccess === "true",
    }));
  }

  return [];
};

export const getTodo = async (id: string) => {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (res.ok) {
    const data = (await res.json()) as TodoType;
    return { ...data, isSuccess: data.isSuccess === "true" };
  }

  notFound();
};

export const createTodo = async (data: FormData) => {
  const res = await fetch(`${ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: new Date(),
      isSuccess: data.get("isSuccess"),
      title: data.get("title"),
      content: data.get("content"),
    }),
  });

  if (res.ok) return redirect("/");

  throw Error("생성되지않았습니다.");
};

export const updateTodo = async (data: FormData) => {
  const res = await fetch(`${ENDPOINT}/${data.get("id")}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      isSuccess: data.get("isSuccess"),
      title: data.get("title"),
      content: data.get("content"),
    }),
  });

  if (res.ok) {
    revalidatePath("/");
    revalidatePath(`/${data.get("id")}`);
    return;
  }

  throw Error("수정되지않았습니다.");
};

export const deleteTodo = async (data: FormData) => {
  const res = await fetch(`${ENDPOINT}/${data.get("id")}`, {
    method: "DELETE",
  });

  if (res.ok) {
    revalidatePath("/");
    revalidatePath(`/${data.get("id")}`);
    redirect("/");
  }

  throw Error("삭제되지않았습니다.");
};
