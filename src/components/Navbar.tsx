"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook
import { useEffect } from "react"; // For useEffect

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // Use isAuthenticated and logout from the context

  useEffect(() => {
    // Trigger a re-render whenever isAuthenticated changes
  }, [isAuthenticated]);

  return (
    <nav className="bg-primary py-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Name on the left */}
        <h1 className="text-white text-2xl font-semibold">Budget Calculator</h1>

        {/* Links on the right */}
        <div className="space-x-4">
          <Link href="/chart">
            <span className="text-white text-sm hover:underline cursor-pointer">My Data</span>
          </Link>
          <Link href="/expenses">
            <span className="text-white text-sm hover:underline cursor-pointer">My Expenses</span>
          </Link>
          <Link href="/">
            <span className="text-white text-sm hover:underline cursor-pointer">Add Expenses</span>
          </Link>

          {/* Conditional rendering based on authentication */}
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <span className="text-white text-sm hover:underline cursor-pointer">Login</span>
              </Link>
              <Link href="/register">
                <span className="text-white text-sm hover:underline cursor-pointer">Register</span>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={logout}
                className="text-white text-sm hover:underline cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
