"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {}, [isAuthenticated]);

  return (
    <nav className="bg-primary py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-white text-2xl font-semibold">
            Budget Calculator
          </h1>
        </Link>

        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/chart">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  My Data
                </span>
              </Link>
              <Link href="/expenses">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  My Expenses
                </span>
              </Link>
              <Link href="/">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  Add Expenses
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-white text-sm hover:underline cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  Add Expenses
                </span>
              </Link>
              <Link href="/login">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="text-white text-sm hover:underline cursor-pointer">
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
