import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DetailForm, PageLayout } from "@/components";

interface TodoType {
  id: string;
  isSuccess: string;
  title: string;
  content: string;
}

const ENDPOINT = "http://localhost:3001/todoList";

const getTodo = async (id: string) => {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = (await res.json()) as TodoType;

  return { ...data, isSuccess: data.isSuccess === "true" };
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
  if (res) {
    revalidatePath(`/${data.get("id")}`);
    revalidatePath("/");
    redirect(`/${data.get("id")}`);
  }
};

const deleteTodo = async (data: FormData) => {
  "use server";
  const res = await fetch(`${ENDPOINT}/${data.get("id")}`, {
    method: "DELETE",
  });

  if (res.ok) {
    revalidatePath("/");
    redirect("/");
  }
};

export default async function Detail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode: string };
}) {
  const data = await getTodo(params.id);

  return (
    <PageLayout>
      <DetailForm
        mode={searchParams.mode === "edit" ? searchParams.mode : "read"}
        {...data}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </PageLayout>
  );
}
