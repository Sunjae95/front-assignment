import styles from "./page.module.scss";
import { PageLayout } from "@/components";
import { TodoList } from "@/components/TodoList";
import { createTodo, deleteTodo, getTodoList, updateTodo } from "./actions";

export default async function Home() {
  const data = await getTodoList();

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
