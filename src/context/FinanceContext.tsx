// FinanceContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Expense {
  name: string;
  cost: string;
  description?: string;
}

interface FinanceContextType {
  income: number | null;
  expenses: Expense[] | null; // Array of Expense objects
  remainingBalance: number | null;
  fetchFinanceData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [income, setIncome] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[] | null>(null); // Corrected type
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);

  const router = useRouter();

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const [incomeResponse, expensesResponse] = await Promise.all([
        axios.get("/api/users/get-income", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/expenses/user-expenses", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // Ensure expenses is set as an array of Expense objects
      setExpenses(expensesResponse.data.expenses);
      setIncome(parseFloat(incomeResponse.data.income)); // Ensure income is a number
      setRemainingBalance(0);
    } catch (error) {
      console.error("Error fetching finance data:", error instanceof Error ? error.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return (
    <FinanceContext.Provider value={{ income, expenses, remainingBalance, fetchFinanceData }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within a FinanceProvider");
  return context;
};
