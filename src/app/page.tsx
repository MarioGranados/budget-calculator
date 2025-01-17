"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


interface InputState {
  name: string;
  cost: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<InputState[]>([
    { name: "", cost: "", description: "" },
  ]);

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

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    localStorage.setItem("expenses", JSON.stringify(expenses));

    const sumOfExpenses: number = expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.cost),
      0
    ); // sum all the expenses
    const remainingBalance: number = parseFloat(income) - sumOfExpenses;
    localStorage.setItem("remainingBalance", remainingBalance.toString());

    router.push("/chart");
  };

  const addMoreExpenses = (): void => {
    setExpenses([...expenses, { name: "", cost: "", description: "" }]);
  };

  const removeExpense = (index: number): void => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-center text-lg">Expense Calculator</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col mb-4">
          <input
            className="my-2 p-2 border rounded bg-gray-800 text-white"
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
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              type="text"
              name="name"
              placeholder="Expense Name"
              value={expense.name}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
              type="text"
              name="cost"
              placeholder="Cost"
              value={expense.cost}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
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
    </div>
  );
}
