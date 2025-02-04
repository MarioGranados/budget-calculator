"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useFinance } from "@/context/FinanceContext"; // Import the context

// Dynamically import ReactApexChart with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChart() {
  const { expenses } = useFinance(); // Get expenses from context

  // If expenses data is null or undefined, set to an empty array to avoid errors
  const expenseList = expenses || [];

  // Map expenses to series and labels for ApexCharts
  const series = expenseList.map((expense) => parseFloat(expense.cost) || 0);
  const labels = expenseList.map((expense) => expense.name || "Unknown");

  // ApexCharts options configuration
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: labels.length > 0 ? labels : ["No Expenses"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px", // Increase font size
      fontWeight: 700, // Make legend text bold
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Expense Distribution
      </h1>
      <div className="chart-section flex justify-center mb-4">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
    </div>
  );
}
