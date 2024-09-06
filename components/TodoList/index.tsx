"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TodoType | null>(null);

  const handleOnUpdate = useCallback(
    (form: Omit<TodoType, "isSuccess">) =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) =>
          formData.append(key, value)
        );
        formData.append("isSuccess", e.target.checked.toString());
        setIsLoading(form.id);
        try {
          await onUpdate(formData);
        } catch (e) {
          const { message } = e as Error;
          setError(message);
        } finally {
          setIsLoading(null);
        }
      },
    []
  );

  const handleOnDelete = useCallback(
    async (id: string) => {
      const formData = new FormData();
      formData.append("id", id);
      try {
        setIsLoading(id);
        await onDelete(formData);
      } catch (e) {
        const { message } = e as Error;
        setError(message);
      } finally {
        setDeleteId(null);
        setIsLoading(null);
      }
    },
    [deleteId, onDelete]
  );

  const handleOnAction = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      setIsLoading((formData.get("id") as string) || "true");

      try {
        if (form?.id) await onUpdate(formData);
        else await onCreate(formData);
      } catch (e) {
        const { message } = e as Error;
        setError(message);
      } finally {
        setIsLoading(null);
        setForm(null);
      }
    },
    [onCreate, onUpdate, form]
  );

  return (
    <>
      <div className={styles["create-wrapper"]}>
        <Button
          theme="dangerous"
          color="green"
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
              <div className={`${styles.header} ${styles.wrapper}`}>
                <Checkbox
                  disabled={isLoading === id}
                  checked={isSuccess}
                  onChange={handleOnUpdate({ id, title, content })}
                />
                <Link href={`${id}`} className={styles.title}>
                  <p>{title}</p>
                </Link>
              </div>
              <div className={`${styles.header} ${styles["button-wrapper"]}`}>
                <Button
                  disabled={isLoading === id}
                  color="black"
                  onClick={() => setForm({ id, isSuccess, title, content })}
                >
                  Update
                </Button>
                <Button
                  disabled={isLoading === id}
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
          isLoading={!!isLoading}
          {...form}
          header={form?.id ? "Update" : "Create"}
          onClose={() => setForm(null)}
          action={handleOnAction}
        />
      )}
      {deleteId && (
        <Alert
          content="todo를 정말 삭제할까요?"
          left={{
            disabled: !!isLoading,
            color: "black",
            children: "cancel",
            onClick: () => setDeleteId(null),
          }}
          right={{
            disabled: !!isLoading,
            theme: "dangerous",
            color: "red",
            children: "ok",
            onClick: () => handleOnDelete(deleteId),
          }}
        />
      )}
      {error !== null && (
        <Alert
          content={error}
          right={{
            children: "ok",
            theme: "dangerous",
            color: "red",
            onClick: () => setError(null),
          }}
        />
      )}
    </>
  );
};
