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
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<InputState[]>([
    { name: "", cost: "", description: "" },
  ]);
  const [hasStoredExpenses, setHasStoredExpenses] = useState(false);

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setHasStoredExpenses(true);
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [name]: value };
    setExpenses(updatedExpenses);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    localStorage.setItem("expenses", JSON.stringify(expenses));
    setHasStoredExpenses(true);
  };

  const addMoreExpenses = (): void => {
    setExpenses([...expenses, { name: "", cost: "", description: "" }]);
  };

  const removeExpense = (index: number): void => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  // Filter valid expenses for chart
  const validExpenses = expenses.filter(
    (expense) => expense.name.trim() && parseFloat(expense.cost) > 0
  );
  const series = validExpenses.map((expense) => parseFloat(expense.cost));
  const labels = validExpenses.map((expense) => expense.name);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "pie",
    },
    labels,
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
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto px-4">
      {hasStoredExpenses ? (
        <>
          <h1 className="text-xl font-semibold mb-4 text-center">Expense Distribution</h1>
          <ReactApexChart options={options} series={series} type="pie" height={350} />
          <button
            onClick={() => {
              localStorage.removeItem("expenses");
              setExpenses([{ name: "", cost: "", description: "" }]);
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
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex flex-col mb-4">
              <input
                className="my-2 p-2 border rounded"
                type="text"
                id="totalIncome"
                name="totalIncome"
                placeholder="Enter Your Monthly Income"
                onChange={(e) => setIncome(e.target.value)}
                value={income}
              />
            </div>
            {expenses.map((expense, index) => (
              <div key={index} className="mb-4">
                <input
                  className="mt-1 p-2 border rounded w-full"
                  type="text"
                  name="name"
                  placeholder="Expense Name"
                  value={expense.name}
                  onChange={(e) => handleChange(e, index)}
                />
                <input
                  className="mt-1 p-2 border rounded w-full"
                  type="text"
                  name="cost"
                  placeholder="Cost"
                  value={expense.cost}
                  onChange={(e) => handleChange(e, index)}
                />
                <input
                  className="mt-1 p-2 border rounded w-full"
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={expense.description}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            ))}
            <div className="mb-4 p-3 flex justify-between space-x-2">
              <button
                className="p-3 mx-2 border bg-red-500 text-white rounded"
                type="button"
                onClick={() => removeExpense(expenses.length - 1)}
              >
                Remove Last
              </button>
              <button
                className="p-3 mx-2 border bg-blue-500 text-white rounded"
                type="button"
                onClick={addMoreExpenses}
              >
                Add Expense
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="p-2 border bg-green-500 text-white rounded"
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