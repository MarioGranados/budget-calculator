// src/app/login/page.tsx
'use client'
import { useState } from 'react';
import axios from '@/lib/axios'; // Make sure to use your axios.ts instance

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/users/login', { email, password });
      
      // You can store the token in localStorage or cookies
      console.log('Login successful:', response.data);

      // Example: store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect or perform any other actions after successful login
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
