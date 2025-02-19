import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetToken } from "@/utils/GetToken";
import { useAppDispatch, useAppSelector } from "@/store/auth.store";
import { verifyUser } from "@/slices/auth.slice";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = GetToken();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  useEffect(() => {
    console.log(pathname, token, user);

    const redirection = () => {
      if (pathname === "/dashboard" && (!token || !user || !user.name)) {
        navigate("/auth/login");
      }

      if (
        (pathname === "/auth/login" || pathname === "/auth/signup") &&
        token &&
        user
      ) {
        navigate("/dashboard");
      }
    };

    if (!isLoading) redirection();

   
  }, [pathname, token, navigate, isLoading, user, dispatch]);

  if (isLoading)
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  // Render children if no redirection happened
  return children;
};

export default ProtectedRoute;
