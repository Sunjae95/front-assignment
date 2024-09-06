"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.scss";
import { Button } from "../Button";
import { Alert } from "../Alert";

export interface ModalProps {
  header: string;
  id?: string;
  isSuccess?: boolean;
  title?: string;
  content?: string;
  action?: (data: FormData) => void;
  onClose: () => void;
}

export const Modal = ({
  header,
  id,
  isSuccess,
  title,
  content,
  action,
  onClose,
}: ModalProps) => {
  const [isMount, setIsMount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ id, isSuccess, title, content });

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleOnClose = () => {
    if (form.title === title && form.content === content) return onClose();
    setIsOpen(true);
  };

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return createPortal(
    <div className={styles.container}>
      <div className={styles.header}>
        <p>{header}</p>
        <Button
          color="black"
          size="small"
          width={"32px"}
          onClick={handleOnClose}
        >
          X
        </Button>
      </div>
      <form className={styles.content} action={action}>
        <input
          className={styles["input-none"]}
          name="id"
          value={form.id}
          onChange={handleOnChange}
        />
        <input
          className={styles["input-none"]}
          name="isSuccess"
          value={form.isSuccess?.toString()}
          onChange={handleOnChange}
        />
        <input
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleOnChange}
        />
        <textarea
          className={styles["text-area"]}
          name="content"
          value={form.content}
          onChange={handleOnChange}
        />
        <Button theme="dangerous" color="blue" type="submit">
          Submit
        </Button>
      </form>
      {isOpen && (
        <Alert
          content="변경사항이 있습니다. 수정을 취소할까요?"
          left={{ children: "cancel", onClick: () => setIsOpen(false) }}
          right={{
            children: "ok",
            theme: "dangerous",
            color: "blue",
            onClick: () => onClose(),
          }}
        />
      )}
    </div>,
    document.body
  );
};
