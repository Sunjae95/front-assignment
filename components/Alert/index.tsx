"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Alert.module.scss";
import { Button, ButtonProps } from "../Button";

interface AlertProps {
  content: string;
  left?: ButtonProps;
  right?: ButtonProps;
}

export const Alert = ({ content, left, right }: AlertProps) => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return createPortal(
    <div className={styles.container}>
      <p className={styles.content}>{content}</p>
      <div className={styles["button-wrapper"]}>
        {left && <Button {...left} width={"100px"} />}
        {right && <Button {...right} width={"100px"} />}
      </div>
    </div>,
    document.body
  );
};
