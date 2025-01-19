"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import the charts with ssr: false
const LineGraph = dynamic(() => import("../../components/LineGraph"), {
  ssr: false,
});
const BarGraph = dynamic(() => import("../../components/PieChart"), {
  ssr: false,
});

const ChartPage = () => {
  const router = useRouter();
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [remainingBalanceAfterExpenses, setRemainingBalanceAfterExpenses] =
    useState<number | null>(null);

  useEffect(() => {
    // Fetch values from localStorage
    const storedRemainingBalance = parseFloat(
      localStorage.getItem("remainingBalance") || "0"
    );
    const storedExpenses = localStorage.getItem("expenses");

    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses) as { cost: string }[];
      const totalExpenses = parsedExpenses.reduce((total, expense) => {
        return total + parseFloat(expense.cost || "0");
      }, 0);

      setTotalExpenses(totalExpenses);

      // Calculate remaining balance after expenses
      if (!isNaN(storedRemainingBalance)) {
        const remainingBalanceAfterExpenses =
          storedRemainingBalance - totalExpenses;
        setRemainingBalance(storedRemainingBalance);
        setRemainingBalanceAfterExpenses(
          remainingBalanceAfterExpenses >= 0 ? remainingBalanceAfterExpenses : 0
        );
      }
    } else {
      // Redirect to the home page if no expenses data in localStorage
      router.push("/");
    }
  }, [router]);

  const clearDataAndGoHome = () => {
    localStorage.clear();
    router.push("/");
  };

  if (remainingBalance === null || totalExpenses === null) {
    return null; // Wait for the useEffect to run and data to be loaded
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 p-5">
      {/* Left Side: Inputs */}
      <div className="flex-1 p-5 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Expense Data
          </h2>
          <div className="text-gray-800 dark:text-gray-300">
            <strong>Remaining Balance:</strong> ${remainingBalance}
          </div>
          <div className="text-gray-800 dark:text-gray-300">
            <strong>Total Expenses:</strong> ${totalExpenses}
          </div>
          <div className="text-gray-800 dark:text-gray-300">
            <strong>Remaining Balance After Expenses:</strong> $
            {remainingBalanceAfterExpenses}
          </div>
          <button
            onClick={clearDataAndGoHome}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Data & Go Home
          </button>
        </div>
      </div>

      {/* Right Side: Graphs */}
      <div className="flex-1 flex flex-col md:flex-row gap-5">
        {/* Pie Graph */}
        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 flex justify-center overflow-hidden shadow-lg">
          <BarGraph />
        </div>
        {/* Line Graph */}
        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 flex justify-center overflow-hidden shadow-lg">
          <LineGraph />
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
