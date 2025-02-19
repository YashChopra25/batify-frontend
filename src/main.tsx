import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Home.tsx";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import DashboardHome from "@/pages/dashboard/DashboardHome.tsx";
import Redirection from "./pages/Redirection.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import { Provider } from "react-redux";
import { store } from "./store/auth.store.tsx";
import App from "./App.tsx";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
