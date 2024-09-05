"use client";
import React from "react";

import styles from "./Button.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "primary" | "dangerous";
  width?: string | number;
  size?: "small" | "default" | "large";
}

export const Button = ({
  theme = "primary",
  size = "default",
  width,
  children,
  ...props
}: React.PropsWithChildren<ButtonProps>) => {
  return (
    <button
      type="button"
      {...props}
      className={`${styles.container} ${styles[theme]} ${styles[size]}`}
      style={
        { "--color": props.color, "--width": width } as React.CSSProperties
      }
    >
      {children}
    </button>
  );
};
