"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext"; 

interface Expense {
  name: string;
  cost: string;
  description?: string;
}

interface FinanceContextType {
  income: number | null;
  expenses: Expense[] | null;
  remainingBalance: number | null;
  fetchFinanceData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [income, setIncome] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);

  const { token, isAuthenticated } = useAuth(); 

  // Memoize the fetchFinanceData function to prevent unnecessary re-renders
  const fetchFinanceData = useCallback(async () => {
    if (!isAuthenticated) {
      // If the user is not authenticated, get data from localStorage
      const storedIncome = localStorage.getItem("income");
      const storedExpenses = localStorage.getItem("expenses");
      const storedBalance = localStorage.getItem("incomeAfterExpenses");

      // Fallback to default values if nothing is found in localStorage
      setIncome(storedIncome ? parseFloat(storedIncome) : 0);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
      setRemainingBalance(storedBalance ? parseFloat(storedBalance) : 0);
      return;
    }

    try {
      // If authenticated, fetch data from the API
      const [incomeResponse, expensesResponse] = await Promise.all([
        axios.get("/api/users/get-income", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/expenses/user-expenses", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // Update state with fetched data from the API, prioritizing API data
      setIncome(parseFloat(incomeResponse.data.income)); // Ensure income is a number
      setExpenses(expensesResponse.data.expenses);
      setRemainingBalance(0); // Or calculate this based on your needs
    } catch (error) {
      console.error("Error fetching finance data:", error instanceof Error ? error.message : "Unknown error");
      // Fallback to localStorage in case of an error fetching from the API
      const storedIncome = localStorage.getItem("income");
      const storedExpenses = localStorage.getItem("expenses");
      const storedBalance = localStorage.getItem("incomeAfterExpenses");

      setIncome(storedIncome ? parseFloat(storedIncome) : 0);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
      setRemainingBalance(storedBalance ? parseFloat(storedBalance) : 0);
    }
  }, [isAuthenticated, token]); // Dependencies for fetchFinanceData

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]); // Re-run fetchFinanceData when it changes

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
