"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {}, [isAuthenticated]);

  return (
    <nav className="bg-primary py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-white text-2xl font-semibold">Budget Calculator</h1>
        </Link>

        {/* Mobile Menu Button */}
        <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/chart">
                <span className="text-white text-sm hover:underline cursor-pointer">My Data</span>
              </Link>
              <Link href="/expenses">
                <span className="text-white text-sm hover:underline cursor-pointer">My Expenses</span>
              </Link>
              <Link href="/">
                <span className="text-white text-sm hover:underline cursor-pointer">Add Expenses</span>
              </Link>
              <button onClick={logout} className="text-white text-sm hover:underline cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/">
                <span className="text-white text-sm hover:underline cursor-pointer">Add Expenses</span>
              </Link>
              <Link href="/login">
                <span className="text-white text-sm hover:underline cursor-pointer">Login</span>
              </Link>
              <Link href="/register">
                <span className="text-white text-sm hover:underline cursor-pointer">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary text-white p-4 space-y-4">
          {isAuthenticated ? (
            <>
              <Link href="/chart" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">My Data</span>
              </Link>
              <Link href="/expenses" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">My Expenses</span>
              </Link>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">Add Expenses</span>
              </Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="block text-sm hover:underline cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">Add Expenses</span>
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">Login</span>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <span className="block text-sm hover:underline cursor-pointer">Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
