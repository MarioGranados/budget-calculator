"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ReactApexChart with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const LineGraph = () => {
  const [remainingBalanceData, setRemainingBalanceData] = useState<number[]>([]);
  const [totalExpensesData, setTotalExpensesData] = useState<number[]>([]);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<number[]>([]);

  useEffect(() => {
    // Fetch values from localStorage
    const storedBalance = parseFloat(localStorage.getItem("remainingBalance") || "0");
    const totalExpenses = parseFloat(localStorage.getItem("totalExpenses") || "0");

    // Generate data over 12 months
    if (!isNaN(storedBalance) && !isNaN(totalExpenses)) {
      const balanceData = Array.from({ length: 12 }, (_, index) => (index + 1) * storedBalance);
      const expensesData = Array.from({ length: 12 }, (_, index) => (index + 1) * totalExpenses);

      // Calculate investment growth with 8% monthly compounding interest
      const investmentData = balanceData.reduce((acc, balance, index) => {
        const previous = acc[index - 1] || 0;
        const current = (previous + balance) * 1.08; // Add balance and apply 8% growth
        return [...acc, parseFloat(current.toFixed(2))]; // Fix to 2 decimal places
      }, [] as number[]);

      setRemainingBalanceData(balanceData);
      setTotalExpensesData(expensesData);
      setInvestmentGrowthData(investmentData);
    }
  }, []);

  const series = [
    {
      name: "Remaining Balance",
      data: remainingBalanceData,
    },
    {
      name: "Total Expenses",
      data: totalExpensesData,
    },
    {
      name: "Investment Growth (8% Monthly)",
      data: investmentGrowthData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      background: "#fff",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Financial Overview with Investment Growth",
      align: "left",
      style: {
        color: "#000",
      },
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
      borderColor: "#000",
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    colors: ["#0000FF", "#FF0000", "#008000"], // Blue for Remaining Balance, Red for Total Expenses, Green for Investment Growth
  };

  return (
    <div className="chart-container">
      <ReactApexChart
        type="line"
        options={options}
        series={series}
        height={350}
      />
    </div>
  );
};

export default LineGraph;
