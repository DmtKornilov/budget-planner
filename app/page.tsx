import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Budget Planner</h1>
      <p>Upload a receipt photo via POST /api/receipts to digitize it.</p>
      <nav>
        <ul>
          <li>
            <Link href="/receipts">Receipts</Link>
          </li>
          <li>
            <Link href="/budget">Monthly Budget Summary</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
