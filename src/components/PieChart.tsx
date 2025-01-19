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
      height: '100%',  // Let the chart fill its container's height
    },
    labels: labels.length > 0 ? labels : ["No Expenses"],
    responsive: [
      {
        breakpoint: 768, // Larger mobile/tablet breakpoint
        options: {
          chart: {
            width: '100%',  // Make the chart fill 100% of the width on mobile
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 480, // Smallest mobile breakpoint
        options: {
          chart: {
            width: '90%',  // Limit width to fit small screens
            height: '250px',  // Set a fixed height to avoid the chart becoming too small
          },
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-xl font-semibold mb-4">Expense Distribution</h1>
      <div className="my-4">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("expenses");
          window.location.reload(); // Reload the page to reflect the cleared data
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Clear Data
      </button>
    </div>
  );
}