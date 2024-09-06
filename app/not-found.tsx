import Link from "next/link";

import { PageLayout } from "@/components";
import styles from "@/styles/error.module.scss";

export default function NotFound() {
  return (
    <PageLayout>
      <div className={styles.container}>
        <h2>페이지를 찾을 수 없어요.</h2>
        <Link href="/">Home으로 돌아가기</Link>
      </div>
    </PageLayout>
  );
}
