import type { Metadata } from "next";

import "@/styles/reset.scss";

export const metadata: Metadata = {
  title: "TODO LIST",
  description: "At&P Partners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
