"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactApexChart with ssr: false to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts";

interface InputState {
  name: string;
  cost: string;
  description: string;
}

export default function Home() {
  // State variables to store income, expenses, and if there are stored expenses
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<InputState[]>([
    { name: "", cost: "", description: "" },
  ]);
  const [hasStoredExpenses, setHasStoredExpenses] = useState<boolean>(false);

  // Effect hook to check localStorage and load stored expenses if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedExpenses = localStorage.getItem("expenses");
      if (storedExpenses) {
        setHasStoredExpenses(true);
        setExpenses(JSON.parse(storedExpenses));
      }
    }
  }, []);

  // Handler for input changes (for both name, cost, description)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [name]: value,
    };
    setExpenses(updatedExpenses);
  };

  // Handler for form submission (stores expenses in localStorage)
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log("Submitting expenses:", expenses); // Debug log to see the state
    localStorage.setItem("expenses", JSON.stringify(expenses)); // Store expenses in localStorage
    setHasStoredExpenses(true); // Update state to render the chart
  };

  // Function to add more expense fields
  const addMoreExpenses = (): void => {
    setExpenses([
      ...expenses,
      { name: "", cost: "", description: "" },
    ]);
  };

  // Function to remove the last expense entry
  const removeExpense = (index: number): void => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // Prepare chart data
  const series = expenses.map((expense) => parseFloat(expense.cost) || 0);
  const labels = expenses.map((expense) => expense.name || "Unknown");

  // Chart options (customized for pie chart)
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "pie", // Pie chart
    },
    labels, // Labels for each segment of the pie chart
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "top", // Adjust the position of the legend
      horizontalAlign: "center", // Center the legend
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value}`, // Format the tooltip values
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
      {hasStoredExpenses ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Expense Distribution</h1>
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={350}
          />
          {/* Button to clear stored expenses from localStorage */}
          <button
            onClick={() => {
              localStorage.removeItem("expenses");
              setExpenses([]);
              setHasStoredExpenses(false);
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear Data
          </button>
        </>
      ) : (
        <>
          <h1 className="text-center text-lg">Expense Calculator</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              {/* Input field for monthly income */}
              <input
                className="my-2 p-2 border"
                type="text"
                id="totalIncome"
                name="totalIncome"
                placeholder="Enter Your Monthly Income"
                onChange={(e) => setIncome(e.target.value)}
                value={income}
              />
            </div>

            {/* Render expense fields dynamically */}
            {expenses.map((expense, index) => (
              <div key={index} className="mb-4">
                {/* Input fields for each expense (name, cost, description) */}
                <input
                  className="mt-1 p-2 border"
                  type="text"
                  name="name"
                  placeholder="Expense Name"
                  value={expense.name}
                  onChange={(e) => handleChange(e, index)}
                />
                <input
                  className="mt-1 p-2 border"
                  type="text"
                  name="cost"
                  placeholder="Cost"
                  value={expense.cost}
                  onChange={(e) => handleChange(e, index)}
                />
                <input
                  className="mt-1 p-2 border"
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={expense.description}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            ))}

            <div className="mb-4 p-3 flex justify-end space-x-2">
              {/* Button to remove the last expense */}
              <button
                className="p-3 mx-2 border bg-red-500 text-white rounded"
                type="button"
                onClick={() => removeExpense(expenses.length - 1)} // Remove the last expense
              >
                Remove Last
              </button>
              {/* Button to add a new expense field */}
              <button
                className="p-3 mx-2 border bg-blue-500 text-white rounded"
                type="button"
                onClick={addMoreExpenses}
              >
                Add Expense
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              {/* Submit button to save expenses */}
              <button
                className="mx-auto p-2 border bg-green-500 text-white"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
