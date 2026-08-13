import type { ReactNode } from "react";

export const metadata = {
  title: "Budget Planner",
  description: "AI-powered receipt digitization and budget tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
