import React, { useState } from "react";
import { AxiosError, isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // State for form fields
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    const payload = {
      email,
      password,
    };

    setLoading(true);
    setError(""); // Reset error message

    try {
      const { data } = await axiosInstance.post<ApiResponse<any>>(
        "/v1/auth/user/login", // Assuming login endpoint is '/v1/auth/user/login'
        payload
      );

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Store token in localStorage (or handle it accordingly)
      navigate("/dashboard"); // Navigate to a different page after successful login
      console.log("Login Success:", data);
    } catch (error: AxiosError | ApiResponse<any> | any) {
      let message =
        error.message || "An error occurred during login. Please try again.";

      if (isAxiosError(error)) {
        message = error.response?.data.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-dark-bg-card">
      <div className="w-full max-w-md p-6 bg-dark-bg !text-[#cfcde4] shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#cfcde4]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-dark-bg-card"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#cfcde4]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-dark-bg-card"
              autoComplete="off"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-blue-500 text-[#cfcde4] rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className="text-[#cfcde4] mt-4">
          Don't have an account?
          <Link to="/auth/signup" className="underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
