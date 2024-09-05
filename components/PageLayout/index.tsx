import React from "react";

import styles from "./PageLayout.module.scss";

export const PageLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className={styles.container}>
      <main className={styles.wrapper}>{children}</main>
    </div>
  );
};
