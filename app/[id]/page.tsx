import { redirect } from "next/navigation";

import { DetailForm, PageLayout } from "@/components";
import { deleteTodo, getTodo, updateTodo } from "../actions";

const handleOnUpdate = async (data: FormData) => {
  "use server";
  await updateTodo(data);
  redirect(`/${data.get("id")}`);
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
        onUpdate={handleOnUpdate}
        onDelete={deleteTodo}
      />
    </PageLayout>
  );
}
