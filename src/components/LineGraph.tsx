"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useFinance } from "@/context/FinanceContext"; // Import the context
import { calculateFinancialData } from "@/app/utils/calculateFinancialData";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineGraph = () => {
  const { income, expenses } = useFinance(); // Get income and expenses from context
  const [investmentPercentage, setInvestmentPercentage] = useState(15);
  const [remainingBalanceData, setRemainingBalanceData] = useState<number[]>([]);
  const [totalExpensesData, setTotalExpensesData] = useState<number[]>([]);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<number[]>([]);
  const currentMonthIndex = new Date().getMonth();

  useEffect(() => {
    if (income && expenses) {
      const { balanceData, investmentData, monthlyExpensesData } = calculateFinancialData(
        income,
        expenses,
        investmentPercentage
      );

      setRemainingBalanceData(balanceData);
      setTotalExpensesData(monthlyExpensesData); // Keep this fixed, as initial total monthly expenses are required
      setInvestmentGrowthData(investmentData);


    }
  }, [income, expenses, investmentPercentage]);

  const series = [
    { name: "Savings (Remaining Balance)", data: remainingBalanceData, color: "#007bff" }, // Blue
    { name: "Total Expenses", data: totalExpensesData, color: "#ff0000" }, // Red
    { name: "Investment Growth", data: investmentGrowthData, color: "#28a745" }, // Green
  ];

  const options: ApexOptions = {
    chart: { type: "line", zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    title: { text: "Financial Overview with Investment Growth", align: "left" },
    xaxis: {
      categories: [
        ...["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(currentMonthIndex),
        ...["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, currentMonthIndex),
      ].slice(0, 12),
    },
    yaxis: { labels: { formatter: (value) => `$${value.toFixed(2)}` } },
  };

  return (
    <div className="p-5 rounded-lg bg-white text-black relative">
      <div className="absolute top-2 right-2 flex flex-col items-end">
        <label className="block text-gray-700 text-sm mb-1">
          Percent from savings to invest (after expenses): {investmentPercentage}%
        </label>
        <input
          type="range"
          value={investmentPercentage}
          onChange={(e) => setInvestmentPercentage(parseInt(e.target.value))}
          min={0}
          max={100}
          className="w-32 cursor-pointer"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Financial Overview
      </h3>

      <ReactApexChart type="line" options={options} series={series} />
    </div>
  );
};

export default LineGraph;
