"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { token, user } = useAuth(); // Use the login function from AuthContext

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("/api/users/verify-email", {
        verificationCode,
      });

      if (response.status === 200) {
        router.push("/"); // Redirect after successful verification
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error verifying email");
      } else {
        setError("Error verifying email");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "/api/users/resend-verification-code",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("A new verification code has been sent to your email.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error resending verification code");
      } else {
        setError("Error resending verification code");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          Verify Your Email
        </h2>

        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-3">
          Did not receive a code?
          <button
            onClick={handleResendCode}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {resendLoading ? "Resending..." : "Resend Verification Code"}
          </button>
        </p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mt-2">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
