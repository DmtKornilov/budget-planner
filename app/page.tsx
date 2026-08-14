import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main>
      <h1>Budget Planner</h1>
      <p className={styles.description}>Upload a receipt photo via POST /api/receipts to digitize it.</p>
      <nav>
        <ul className={styles.nav}>
          <li>
            <Link href="/receipts" className={styles.navLink}>
              Receipts
            </Link>
          </li>
          <li>
            <Link href="/budget" className={styles.navLink}>
              Monthly Budget Summary
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
