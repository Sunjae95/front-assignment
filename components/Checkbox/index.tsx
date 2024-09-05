"use client";
import React from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  return (
    <label className={styles.label}>
      <input {...props} type="checkbox" className={styles.input} />
      <div className={styles.checkbox}>
        <svg
          className={styles["check-icon"]}
          width={24}
          height={24}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.55 17.308L4.58 12.338L5.294 11.625L9.55 15.881L18.706 6.72498L19.419 7.43898L9.55 17.308Z"
            fill="white"
          />
        </svg>
      </div>
      {label && <p>{label}</p>}
    </label>
  );
};
