"use client";
import React, { useCallback, useState } from "react";
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
  }, [push, pathname]);

  const handleOnClickAlert = useCallback(() => {
    if (mode === "edit") {
      setIsOpen(false);
      push(pathname);
    } else {
      const data = new FormData();
      data.append("id", params.id);
      onDelete(data);
    }
  }, [params, push, pathname, onDelete]);

  const handleOnUpdate = useCallback(
    (data: FormData) => {
      data.append("id", params.id);
      data.append("isSuccess", isSuccess.toString());
      onUpdate(data);
    },
    [push, pathname, onUpdate]
  );

  const handleOnChangeCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, isSuccess: e.target.checked }));
      const data = new FormData();
      data.append("id", params.id);
      data.append("isSuccess", e.target.checked.toString());
      data.append("title", form.title);
      data.append("content", form.content);
      onUpdate(data);
    },
    [form.title, form.content, onUpdate]
  );

  return (
    <form className={styles.container} action={handleOnUpdate}>
      <div className={styles.header}>
        {mode === "edit" ? (
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleOnChange}
          />
        ) : (
          <>
            <Checkbox
              label={title}
              checked={form.isSuccess}
              onChange={handleOnChangeCheckbox}
            />
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
          </>
        )}
      </div>
      {mode === "edit" ? (
        <textarea
          className={styles.content}
          name="content"
          value={form.content}
          onChange={handleOnChange}
        />
      ) : (
        <p className={styles.content}>{content}</p>
      )}
      <div className={styles["button-wrapper"]}>
        {mode === "edit" ? (
          <>
            <Button type="submit" theme="dangerous" color="red" width={"80px"}>
              Ok
            </Button>
            <Button
              color="black"
              width={"80px"}
              onClick={handleOnClickEditPrevious}
            >
              Previous
            </Button>
          </>
        ) : (
          <Button color="black" width={"80px"} onClick={() => push("/")}>
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
            color: "black",
            children: "Cancel",
            onClick: () => setIsOpen(false),
          }}
          right={{
            theme: "dangerous",
            color: "red",
            children: "Ok",
            onClick: handleOnClickAlert,
          }}
        />
      )}
    </form>
  );
};
