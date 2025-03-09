import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetToken } from "@/utils/GetToken";

import { useAppDispatch, useAppSelector } from "@/store/auth.store";
import { verifyUser } from "@/slices/auth.slice";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = GetToken();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      dispatch(verifyUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    // Wait until loading is finished before making navigation decisions
    if (isLoading) return;

    if (pathname === "/dashboard" && (!token || !user?.name)) {
      navigate("/auth/login", { replace: true }); // `replace: true` prevents flickering
    }

    if (
      (pathname === "/auth/login" || pathname === "/auth/signup") &&
      token &&
      user
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, token, user, isLoading, navigate]);

  if (isLoading)
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );

  return children;
};

export default ProtectedRoute;
