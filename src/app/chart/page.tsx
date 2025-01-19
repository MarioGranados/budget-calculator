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
    <div className="chart-page-container">
      {/* Left Side: Inputs */}
      <div className="inputs-section">
        <h2>Expense Data</h2>
        <div>
          <strong>Remaining Balance:</strong> ${remainingBalance}
        </div>
        <div>
          <strong>Total Expenses:</strong> ${totalExpenses}
        </div>
        <div>
          <strong>Remaining Balance After Expenses:</strong> $
          {remainingBalanceAfterExpenses}
        </div>
        <button onClick={clearDataAndGoHome} className="btn-clear">
          Clear Data & Go Home
        </button>
      </div>

      {/* Right Side: Graphs */}
      <div className="graphs-section">
        <div className="pie-graph">
          <BarGraph />
        </div>
        <div className="line-graph">
          <LineGraph />
        </div>
      </div>

      <style jsx>{`
        .chart-page-container {
          display: grid;
          grid-template-columns: 1fr 2fr;
          grid-template-rows: auto auto;
          gap: 20px;
          padding: 20px;
        }
        .inputs-section {
          grid-column: 1 / 2;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
        }
        .graphs-section {
          grid-column: 2 / 3;
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
        }
        .pie-graph,
        .line-graph {
          border: 1px solid #ccc;
          padding: 30px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 100%; /* Ensure the container is fully sized */
          height: 400px; /* Adjust height to avoid overflow */
          overflow: hidden; /* Hide overflow */
        }

        .btn-clear {
          padding: 10px;
          background-color: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        .btn-clear:hover {
          background-color: #d9363e;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .chart-page-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          .inputs-section {
            grid-column: 1 / 2;
            margin-bottom: 20px;
          }
          .inputs-section div {
            font-size: 12px; /* Make the text smaller */
          }
          .graphs-section {
            grid-column: 1 / 2;
            display: grid;
            grid-template-rows: 1fr 1fr;
          }
          .pie-graph,
          .line-graph {
            padding: 10px;
            height: 500px; /* Reduce chart height on mobile */
            width: 100%;

          }

          .btn-clear {
            font-size: 12px; /* Make button text smaller */
          }
        }
      `}</style>
    </div>
  );
};

export default ChartPage;
