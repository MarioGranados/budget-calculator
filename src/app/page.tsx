"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from '@/lib/axios'; // Ensure you're using your axios.ts instance

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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const totalExpenses: number = expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.cost),
      0
    ); // sum all the expenses

    const incomeAfterExpenses: number = parseFloat(income) - totalExpenses;
    localStorage.setItem("incomeAfterExpenses", incomeAfterExpenses.toString());

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      // Ensure there's a token before making the request
      if (!token) {
        console.error("No token found");
        return;
      }

      // Make the POST request to add expenses to the backend
      await axios.post(
        `/api/expenses/add-expenses`, // Backend API endpoint
        { expenses }, // Send the expenses array
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );

      await axios.put(
        `/api/users/update-income`,
        { income },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to the chart page after successful submission
      router.push("/chart");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error submitting expenses:", err.message);
      } else {
        console.error("Error submitting expenses:", err);
      }
    }
    
    
    
  };

  const addMoreExpenses = (): void => {
    setExpenses([...expenses, { name: "", cost: "", description: "" }]);
  };

  const removeExpense = (index: number): void => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-center text-lg">Expense Calculator</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col mb-4">
            <input
              className="my-2 p-2 border rounded bg-gray-50 text-black"
              type="text"
              id="totalIncome"
              name="totalIncome"
              placeholder="Enter Your Monthly Income (After Taxes)"
              onChange={(e) => setIncome(e.target.value)}
              value={income}
              required
            />
          </div>

          {expenses.map((expense, index) => (
            <div key={index} className="mb-4">
              <input
                className="mt-1 p-2 border rounded w-full bg-gray-50 text-black"
                type="text"
                name="name"
                placeholder="Expense Name"
                value={expense.name}
                onChange={(e) => handleChange(e, index)}
                required
              />
              <input
                className="mt-1 p-2 border rounded w-full bg-gray-50 text-black"
                type="text"
                name="cost"
                placeholder="Cost"
                value={expense.cost}
                onChange={(e) => handleChange(e, index)}
                required
              />
              <input
                className="mt-1 p-2 border rounded w-full bg-gray-50 text-black"
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
    </div>
  );
}
