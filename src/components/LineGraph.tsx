"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useFinance } from "@/context/FinanceContext";
import { calculateFinancialData } from "@/app/utils/calculateFinancialData";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineGraph = () => {
  const { income, expenses } = useFinance();
  const [investmentPercentage, setInvestmentPercentage] = useState(15);
  const [remainingBalanceData, setRemainingBalanceData] = useState<number[]>([]);
  const [totalExpensesData, setTotalExpensesData] = useState<number[]>([]);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<number[]>([]);
  const currentMonthIndex = new Date().getMonth();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  useEffect(() => {
    if (income && expenses) {
      const { balanceData, investmentData, monthlyExpensesData } = calculateFinancialData(
        income,
        expenses,
        investmentPercentage
      );

      setRemainingBalanceData(balanceData);
      setTotalExpensesData(monthlyExpensesData);
      setInvestmentGrowthData(investmentData);
    }
  }, [income, expenses, investmentPercentage]);

  const series = [
    { name: "Savings (Remaining Balance)", data: remainingBalanceData },
    { name: "Total Expenses", data: totalExpensesData },
    { name: "Investment Growth", data: investmentGrowthData },
  ];

  const options: ApexOptions = {
    chart: { type: "line", zoom: { enabled: false }, toolbar: { show: false } },
    colors: ["#007bff", "#ff0000", "#28a745"], // Blue, Red, Green
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    title: { text: "Financial Overview with Investment Growth", align: "center", style: { fontSize: "16px" } },
    xaxis: {
      categories: [...months.slice(currentMonthIndex), ...months.slice(0, currentMonthIndex)],
      labels: { rotate: -45 },
    },
    yaxis: {
      labels: { formatter: (value) => `$${value.toFixed(2)}` },
      title: { text: "Amount ($)" },
    },
    legend: { position: "top", horizontalAlign: "center" },
  };

  return (
    <div className=" text-black relative">
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
        Financial Overview
      </h3>

      {/* Slider Section */}
      <div className="flex flex-col items-center mb-5">
        <label className="text-sm text-gray-700 font-medium mb-1">
          Investment Percentage: {investmentPercentage}%
        </label>
        <input
          type="range"
          value={investmentPercentage}
          onChange={(e) => setInvestmentPercentage(parseInt(e.target.value))}
          min={0}
          max={100}
          className="w-48 cursor-pointer accent-blue-500"
        />
      </div>

      <ReactApexChart type="line" options={options} series={series} height={350} />
    </div>
  );
};

export default LineGraph;
