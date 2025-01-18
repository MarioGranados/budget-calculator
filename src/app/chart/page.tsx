"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import the charts with ssr: false
const LineGraph = dynamic(() => import("../../components/LineGraph"), { ssr: false });
const BarGraph = dynamic(() => import("../../components/PieChart"), { ssr: false });

interface InputState {
  name: string;
  cost: string;
  description: string;
}

const ChartPage = () => {
  const router = useRouter();
  const [income, setIncome] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<InputState[] | null>(null);

  useEffect(() => {
    // Fetch stored values on load
    const storedIncome = localStorage.getItem("income");
    const storedExpenses = localStorage.getItem("expenses");

    if (storedIncome && storedExpenses) {
      setIncome(storedIncome);
      setExpenses(JSON.parse(storedExpenses));
    } else {
      // Redirect to the home page if no data in localStorage
      router.push("/");
    }
  }, [router]);

  const clearDataAndGoHome = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!income || !expenses) {
    return null; // Wait for the useEffect to run
  }

  return (
    <div className="chart-page-container">
      {/* Left Side: Inputs */}
      <div className="inputs-section">
        <h2>Expense Data</h2>
        <div>
          <strong>Monthly Income:</strong> {income}
        </div>
        <div>
          <strong>Expenses:</strong>
          {expenses.map((expense, index) => (
            <div key={index}>
              <p>
                <strong>{expense.name}</strong>: ${expense.cost} - {expense.description}
              </p>
            </div>
          ))}
        </div>
        <button onClick={clearDataAndGoHome} className="btn-clear">
          Clear Data & Go Home
        </button>
      </div>

      {/* Right Side: Graphs */}
      <div className="graphs-section">
        <div className="line-graph">
          <h3>Line Graph</h3>
          <LineGraph />
        </div>
        <div className="bar-graph">
          <h3>Bar Graph</h3>
          <BarGraph />
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
        .line-graph,
        .bar-graph {
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
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
      `}</style>
    </div>
  );
};

export default ChartPage;