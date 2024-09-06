"use client";
import { PageLayout } from "@/components";
import styles from "@/styles/error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageLayout>
      <div className={styles.container}>
        <h2>{error.message}</h2>
        <button onClick={() => reset()}>Try again</button>
      </div>
    </PageLayout>
  );
}
