"use client";
import React, { useCallback, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import styles from "./DetailForm.module.scss";
import { Checkbox } from "../Checkbox";
import { Button } from "../Button";
import { Alert } from "../Alert";

interface DetailFormProps {
  mode: "read" | "edit";
  id: string;
  isSuccess: boolean;
  title: string;
  content: string;
  onUpdate: (data: FormData) => Promise<void>;
  onDelete: (data: FormData) => Promise<void>;
}

export const DetailForm = ({
  mode,
  isSuccess,
  title,
  content,
  onUpdate,
  onDelete,
}: DetailFormProps) => {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const { push } = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ isSuccess, title, content });

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleOnClickEditPrevious = useCallback(() => {
    if (title !== form.title || content !== form.content) {
      setIsOpen(true);
    } else {
      push(pathname);
    }
  }, [push, pathname, form.title, form.content]);

  const handleGoReadDetail = () => {
    setIsOpen(false);
    setForm({ isSuccess, title, content });
    push(pathname);
  };

  const handleOnDelete = async () => {
    setIsLoading(true);

    const data = new FormData();
    data.append("id", params.id);

    try {
      await onDelete(data);
    } catch (e) {
      const { message } = e as Error;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      try {
        await onUpdate(formData);
      } catch (e) {
        const { message } = e as Error;
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdate]
  );

  const handleOnChangeCheckbox = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, isSuccess: e.target.checked }));
      if (!ref.current) return;
      setIsLoading(true);
      const data = new FormData(ref.current);
      data.set("isSuccess", e.target.checked.toString());
      try {
        await onUpdate(data);
      } catch (e) {
        const { message } = e as Error;
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form.title, form.content, onUpdate]
  );

  return (
    <form ref={ref} className={styles.container} onSubmit={handleOnUpdate}>
      <input
        className={styles["input-none"]}
        name="id"
        value={params.id}
        onChange={handleOnChange}
      />
      <input
        className={styles["input-none"]}
        name="isSuccess"
        value={form.isSuccess.toString()}
        onChange={handleOnChange}
      />
      <div className={styles.header}>
        {mode === "read" && (
          <Checkbox
            name="isSuccess"
            checked={form.isSuccess}
            onChange={handleOnChangeCheckbox}
          />
        )}
        <input
          readOnly={mode === "read"}
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleOnChange}
        />
        {mode === "read" && (
          <div className={styles["button-wrapper"]}>
            <Button
              color="black"
              width={"80px"}
              onClick={() => push("?mode=edit")}
            >
              Update
            </Button>
            <Button
              theme="dangerous"
              color="red"
              width={"80px"}
              onClick={() => setIsOpen(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      <textarea
        readOnly={mode === "read"}
        className={styles.content}
        name="content"
        value={form.content}
        onChange={handleOnChange}
      />
      <div className={styles["button-wrapper"]}>
        {mode === "edit" ? (
          <>
            <Button
              disabled={isLoading}
              type="submit"
              theme="dangerous"
              color="blue"
              width={"80px"}
            >
              Ok
            </Button>
            <Button
              disabled={isLoading}
              color="black"
              width={"80px"}
              onClick={handleOnClickEditPrevious}
            >
              Previous
            </Button>
          </>
        ) : (
          <Button
            disabled={isLoading}
            color="black"
            width={"80px"}
            onClick={() => push("/")}
          >
            Previous
          </Button>
        )}
      </div>
      {isOpen && (
        <Alert
          content={
            mode === "edit"
              ? "변경사항이 있습니다. 수정을 취소할까요?"
              : "todo를 정말 삭제할까요?"
          }
          left={{
            disabled: isLoading,
            color: "black",
            children: "Cancel",
            onClick: () => setIsOpen(false),
          }}
          right={{
            disabled: isLoading,
            theme: "dangerous",
            color: "blue",
            children: "Ok",
            onClick: () => {
              if (mode === "edit") handleGoReadDetail();
              else handleOnDelete();
            },
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
    </form>
  );
};
