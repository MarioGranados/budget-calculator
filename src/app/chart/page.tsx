"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from '@/lib/axios'; // Ensure you're using your axios.ts instance

// Dynamically import the charts with ssr: false
const LineGraph = dynamic(() => import("../../components/LineGraph"), {
  ssr: false,
});
const PieChart = dynamic(() => import("../../components/PieChart"), {
  ssr: false,
});

const ChartPage = () => {
  const router = useRouter();
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [remainingBalanceAfterExpenses, setRemainingBalanceAfterExpenses] =
    useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        // Fetch income data
        const incomeResponse = await axios.get("/api/users/get-income", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const incomeAfterExpenses = incomeResponse.data.income;

        // Fetch expenses data
        const expensesResponse = await axios.get("/api/expenses/user-expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const expenses = expensesResponse.data;
        const totalExpenses = expenses.reduce(
          (total: number, expense: { cost: string }) =>
            total + parseFloat(expense.cost || "0"),
          0
        );

        setTotalExpenses(totalExpenses);

        // Calculate remaining balance after expenses
        if (!isNaN(incomeAfterExpenses)) {
          const remainingBalanceAfterExpenses =
            incomeAfterExpenses - totalExpenses;
          setRemainingBalance(incomeAfterExpenses);
          setRemainingBalanceAfterExpenses(
            remainingBalanceAfterExpenses >= 0 ? remainingBalanceAfterExpenses : 0
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Optionally handle the error by redirecting or showing a message
      }
    };

    fetchUserData();
  }, [router]);

  const clearDataAndGoHome = () => {
    localStorage.clear();
    window.location.reload(); // Refresh to apply changes
    router.push("/");
  };

  // Function to format numbers in USD format
  const formatCurrency = (value: number | null) => {
    return value === null ? "0" : `$${value.toLocaleString()}`;
  };

  if (remainingBalance === null || totalExpenses === null) {
    return null; // Wait for the useEffect to run and data to be loaded
  }

  return (
    <div className="bg-gray-50 text-black my-10">
      {/* Outer Container for Left/Right Padding */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* Top Section: Inputs and Pie Chart */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Inputs Section */}
          <div className="flex-1 p-5 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Expense Data</h2>
              <div>
                <strong>Total Expenses:</strong> {formatCurrency(totalExpenses)}
              </div>
              <div>
                <strong>Remaining Balance After Expenses:</strong>{" "}
                {formatCurrency(remainingBalanceAfterExpenses)}
              </div>
              <button
                onClick={clearDataAndGoHome}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Data & Go Home
              </button>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex-1 p-5 rounded-lg shadow-lg">
            <PieChart />
          </div>
        </div>

        <div className="my-10 mx-10 space-y-4">
          <p>
            If you are using this tool, know that I am not a financial advisor
            and don&apos; have any credentials. I built this tool to estimate my
            yearly financial goals and explore different investment strategies
            for myself. This tool was created for my situation, but feel free to
            use it as you see fit.
          </p>

          <p>
            If you would like to modify the code or use it for yourself, you can
            do so
            <a href="http://" className="text-blue-500 hover:underline">
              {" "}
              here
            </a>
            .
          </p>

          <p>The graph below shows:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              Expense over 12 months - mostly just used to see how much I spend
              a year
            </li>
            <li>
              Income after expenses over 12 months - I use this to determine my
              needs and wants
            </li>
            <li>
              Contribution to a savings account - I was recommended to save 15%
              of my income, feel free to change it via the slider
            </li>
          </ul>
        </div>

        {/* Bottom Section: Line Graph */}
        <div className="p-5 rounded-lg shadow-lg">
          <LineGraph />
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
