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
  description: string;
}

const LineGraph = () => {
  const [remainingBalanceData, setRemainingBalanceData] = useState<number[]>(
    []
  );
  const [totalExpensesData, setTotalExpensesData] = useState<number[]>([]);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<number[]>(
    []
  );
  const currentMonthIndex = new Date().getMonth(); // Current month index (0-11)

  useEffect(() => {
    const storedBalance = parseFloat(
      localStorage.getItem("remainingBalance") || "1000"
    ); // Assume $1000 as the initial balance
    const storedExpenses = localStorage.getItem("expenses");

    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses) as Expense[];

      const totalMonthlyExpenses = parsedExpenses.reduce((total, expense) => {
        const cost = parseFloat(expense.cost || "0");
        return total + cost;
      }, 0);

      console.log("Total Monthly Expenses:", totalMonthlyExpenses);

      // Generate dynamic months starting from the current month
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const categories = [
        ...months.slice(currentMonthIndex),
        ...months.slice(0, currentMonthIndex),
      ];

      // Calculate dynamic total expenses over 12 months
      const expensesData = Array.from({ length: 12 }, (_, index) => {
        return totalMonthlyExpenses * (index + 1); // Cumulative monthly total
      });

      if (!isNaN(storedBalance)) {
        // Calculate remaining balance over 12 months (starts with $1000 and decreases by total expenses every month)
        let savings = storedBalance;
        const balanceData = Array.from({ length: 12 }, (_, index) => {
          savings -= totalMonthlyExpenses; // Subtract monthly expenses
          return savings >= 0 ? savings : 0; // Ensure the balance doesn't go below 0
        });

        // Apply 8% annual interest, compounded annually but calculated monthly
        const annualInterestRate = 0.08; // 8% annual interest rate
        const investmentData: number[] = [];
        let currentInvestment = storedBalance;
        for (let i = 0; i < 12; i++) {
          currentInvestment =
            (currentInvestment - totalMonthlyExpenses) *
            (1 + annualInterestRate / 12); // Apply monthly compounding
          investmentData.push(parseFloat(currentInvestment.toFixed(2)));
        }

        setRemainingBalanceData(balanceData);
        setTotalExpensesData(expensesData);
        setInvestmentGrowthData(investmentData);
      }
    }
  }, [currentMonthIndex]);

  const series = [
    {
      name: "Savings (Remaining Balance)",
      data: remainingBalanceData,
    },
    {
      name: "Total Expenses",
      data: totalExpensesData,
    },
    {
      name: "Investment Growth (8% Annual)",
      data: investmentGrowthData,
    },
  ];

  const options: ApexOptions = {
    chart: {
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
        ...[
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ].slice(currentMonthIndex),
        ...[
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ].slice(0, currentMonthIndex),
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
    colors: ["#0000FF", "#FF0000", "#008000"], // Blue for Savings, Red for Expenses, Green for Investment Growth
    legend: {
      show: true,
      position: "bottom", // Position the legend at the bottom
      horizontalAlign: "center",
      fontSize: "14px",
      fontWeight: 600,
      labels: {
        colors: "#000",
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: 768, // Larger mobile/tablet breakpoint
        options: {
          title: {
            align: "center", // Center the title for smaller screens
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 480, // Smallest mobile breakpoint
        options: {
          title: {
            align: "center", // Center the title for smallest screens
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Total Monthly Expenses
      </h3>
      <div className="text-gray-800 dark:text-gray-300 mb-2">
        <strong>Total Monthly Expenses: </strong>${totalExpensesData[0] || 0}
      </div>
      <div className="text-gray-800 dark:text-gray-300 mb-2">
        <strong>Total Expenses Over 12 Months: </strong>
        ${(totalExpensesData[11] || 0).toFixed(2)}
      </div>
      <div className="text-gray-800 dark:text-gray-300 mb-2">
        <strong>Total Remaining Balance Over 12 Months: </strong>
        ${remainingBalanceData.reduce((acc, val) => acc + val, 0).toFixed(2)}
      </div>
      <div className="text-gray-800 dark:text-gray-300 mb-4">
        <strong>Total Savings with Stock Investment Over 12 Months: </strong>
        ${investmentGrowthData.reduce((acc, val) => acc + val, 0).toFixed(2)}
      </div>

      <ReactApexChart type="line" options={options} series={series} />
    </div>
  );
};

export default LineGraph;
