import React, { useState } from "react";
import { AxiosError, isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ApiResponseCreateLink } from "@/Types";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  // State for form fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    const payload = {
      name,
      email,
      password,
    };

    setLoading(true);
    setError(""); // Reset error message

    try {
      const { data } = await axiosInstance.post<ApiResponse<any>>(
        "/v1/auth/user/create",
        payload
      );
      if (!data.success) {
        setError(data.message);
        return;
      }
      navigate("/dashboard"); // Navigate to a different page after successful login
      console.log("Signup Success:", data);
    } catch (error: AxiosError | ApiResponse<ApiResponseCreateLink> | any) {
      let message =
        error.message || "An error occurred during signup. Please try again.";
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
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-dark-bg shadow-lg rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#cfcde4]">
          Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#cfcde4]"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-dark-bg-card"
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Enter your password"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-blue-500 text-[#cfcde4] rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-[#cfcde4] mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
