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
  const [income, setIncome] = useState<string>("");
  const [expenses, setExpenses] = useState<InputState[]>([
    { name: "", cost: "", description: "" },
  ]);

  useEffect(() => {
    // Fetch stored values on load
    const storedIncome = localStorage.getItem("income");
    const storedExpenses = localStorage.getItem("expenses");
    if (storedIncome) setIncome(storedIncome);
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
  }, []);

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
    localStorage.setItem("income", income);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    const sumOfExpenses: number = expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.cost || "0"),
      0
    );
    const remainingBalance: number = parseFloat(income || "0") - sumOfExpenses;
    localStorage.setItem("remainingBalance", remainingBalance.toString());

    alert("Inputs saved! Refresh graphs to see the updated data.");
  };

  const addMoreExpenses = (): void => {
    setExpenses([...expenses, { name: "", cost: "", description: "" }]);
  };

  const removeExpense = (index: number): void => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="chart-page-container">
      {/* Left Side: Inputs */}
      <div className="inputs-section">
        <h2>Expense Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter Your Monthly Income"
              className="input"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </div>
          {expenses.map((expense, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder="Expense Name"
                className="input"
                value={expense.name}
                onChange={(e) => handleChange(e, index)}
              />
              <input
                type="text"
                name="cost"
                placeholder="Cost"
                className="input"
                value={expense.cost}
                onChange={(e) => handleChange(e, index)}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="input"
                value={expense.description}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          ))}
          <div className="buttons">
            <button type="button" onClick={addMoreExpenses} className="btn">
              Add Expense
            </button>
            <button
              type="button"
              onClick={() => removeExpense(expenses.length - 1)}
              className="btn"
            >
              Remove Last
            </button>
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </form>
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
        .input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .btn,
        .btn-submit {
          padding: 10px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn:hover,
        .btn-submit:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ChartPage;
