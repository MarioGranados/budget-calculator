"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ReactApexChart with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Expense {
  name: string;
  cost: string;
  description?: string;
}

export default function PieChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedExpenses = localStorage.getItem("expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    }
  }, []);

  // Map expenses to series and labels for ApexCharts
  const series = expenses.map((expense) => parseFloat(expense.cost) || 0);
  const labels = expenses.map((expense) => expense.name || "Unknown");

  // ApexCharts options configuration
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: labels.length > 0 ? labels : ["No Expenses"],
    responsive: [
      {
        breakpoint: 768, 
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 480, 
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
  };
  

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
  <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">Expense Distribution</h1>
  <div className="chart-section flex justify-center mb-4">
    <ReactApexChart options={options} series={series} type="donut" />
  </div>

  <button
    onClick={() => {
      localStorage.removeItem("expenses");
      window.location.reload();
    }}
    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mx-auto block"
  >
    Clear Data
  </button>
</div>

  );
}
