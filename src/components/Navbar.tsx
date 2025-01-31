// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary py-5">
      <div className="container mx-auto text-center">
        <h1 className="text-white text-2xl font-semibold mb-4">Budget Calculator</h1>
        <div className="space-x-4">
          <Link href="/chart">
            <span className="text-white text-sm hover:underline cursor-pointer">Chart</span>
          </Link>
          <Link href="/expenses">
            <span className="text-white text-sm hover:underline cursor-pointer">Expenses</span>
          </Link>
          <Link href="/login">
            <span className="text-white text-sm hover:underline cursor-pointer">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
