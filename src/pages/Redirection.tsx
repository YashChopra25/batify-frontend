import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Redirection = () => {
  const { shortLink } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/v1/urls/${shortLink}`);
      if (!data.success) {
        navigate("/");
        ToastFn("error", "Error", data.message);
        return;
      }
      console.log(data);
      window.location.replace(data?.redirectOn);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        ToastFn("error", "Error", error.message || "Something went wrong");
        return;
      }
      ToastFn("error", "Error", error.response?.data.message);
      navigate("/");
    } finally {
    }
  };

  useEffect(() => {
    if (shortLink) {
      fetchRecords();
    }
  }, [shortLink]); // Dependency is shortLink, not params

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default Redirection;
