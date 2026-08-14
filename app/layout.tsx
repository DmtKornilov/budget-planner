import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata = {
  title: "Budget Planner",
  description: "AI-powered receipt digitization and budget tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.shell}>
          <header className={styles.header}>
            <Link href="/" className={styles.brand}>
              Budget Planner
            </Link>
            <ul className={styles.nav}>
              <li>
                <Link href="/receipts" className={styles.navLink}>
                  Receipts
                </Link>
              </li>
              <li>
                <Link href="/budget" className={styles.navLink}>
                  Budget
                </Link>
              </li>
            </ul>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
