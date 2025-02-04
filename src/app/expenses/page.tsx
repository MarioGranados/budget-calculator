// src/app/expenses/page.tsx
'use client'
import { useEffect, useState } from 'react';
import axios from '@/lib/axios'; // Ensure you're using your axios.ts instance

interface Expense {
  _id: string;  // Assuming you use MongoDB's default _id field
  name: string;
  description: string;
  cost: number;
}

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's expenses
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses/user-expenses');
        setExpenses(response.data.expenses); // Access expenses from the response data
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error submitting expenses:", err.message);
        } else {
          console.error("Error submitting expenses:", err);
        }
      }
      
       finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/delete-expense/${id}`);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id)); // Remove the deleted expense
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error submitting expenses:", err.message);
      } else {
        console.error("Error submitting expenses:", err);
      }
    }
    
    
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-screen-xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Your Expenses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{expense.name}</h3>
              <p className="text-sm text-gray-600">{expense.description}</p>
              <p className="mt-2 font-medium text-gray-900">${expense.cost}</p>
            </div>
            <button
              onClick={() => handleDelete(expense._id)}  // Use _id for MongoDB document identifier
              className="bg-red-500 text-white rounded-full px-4 py-2 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesPage;
