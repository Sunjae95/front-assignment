"use client";
import React, { useCallback, useState } from "react";

import styles from "./TodoList.module.scss";

import { Button } from "../Button";
import { Modal } from "../Modal";
import { Checkbox } from "../Checkbox";
import { Alert } from "../Alert";

interface TodoType {
  id: string;
  isSuccess: boolean;
  title: string;
  content: string;
}

interface TodoListProps {
  data: TodoType[];
  onCreate: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
}

const initialForm = { id: "", isSuccess: false, title: "", content: "" };

export const TodoList = ({
  data,
  onCreate,
  onUpdate,
  onDelete,
}: TodoListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TodoType | null>(null);

  const handleOnUpdate = useCallback(
    (form: Omit<TodoType, "isSuccess">) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) =>
          formData.append(key, value)
        );
        formData.append("isSuccess", e.target.checked.toString());

        onUpdate(formData);
      },
    []
  );

  const handleOnDelete = useCallback(async () => {
    if (deleteId) {
      const formData = new FormData();
      formData.append("id", deleteId);

      await onDelete(formData);
    }
    setDeleteId(null);
  }, [deleteId, onDelete]);

  const handleOnAction = useCallback(
    async (data: FormData) => {
      if (form?.id) await onUpdate(data);
      else await onCreate(data);

      setForm(null);
    },
    [onCreate, onUpdate, form]
  );

  return (
    <>
      <div className={styles["create-wrapper"]}>
        <Button
          theme="primary"
          color="black"
          width={"70px"}
          onClick={() => setForm(initialForm)}
        >
          Create
        </Button>
      </div>
      <div className={styles["todo-wrapper"]}>
        {data.map(({ id, isSuccess, title, content }) => (
          <div key={`todo-${id}`} className={styles.container}>
            <div className={styles.header}>
              <Checkbox
                checked={isSuccess}
                label={title}
                onChange={handleOnUpdate({ id, title, content })}
              />
              <div className={styles["button-wrapper"]}>
                <Button
                  color="black"
                  onClick={() => setForm({ id, isSuccess, title, content })}
                >
                  Update
                </Button>
                <Button
                  theme="dangerous"
                  color="red"
                  onClick={() => setDeleteId(id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className={styles.content}>{content}</p>
          </div>
        ))}
      </div>
      {form && (
        <Modal
          {...form}
          header={form?.id ? "update" : "create"}
          onClose={() => setForm(null)}
          action={handleOnAction}
        />
      )}
      {deleteId && (
        <Alert
          content="todo를 정말 삭제할까요?"
          left={{
            color: "black",
            children: "cancel",
            onClick: () => setDeleteId(null),
          }}
          right={{ color: "red", children: "ok", onClick: handleOnDelete }}
        />
      )}
    </>
  );
};
