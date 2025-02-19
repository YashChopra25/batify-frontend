import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ToastFn from "@/components/Toaster";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import { AxiosError, isAxiosError } from "axios";
const LinkGenerator = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [shortURl, setshortURl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      ToastFn("error", "Error", "Please enter a valid link");
      return;
    }
    setIsLoading(true);
    try {
      const { data: responseData } = await axiosInstance.post<
        ApiResponse<ApiResponseCreateLink>
      >("/v1/urls/create", {
        longUrl: inputValue,
      });
      if (!responseData.success) {
        ToastFn("error", "Failed", responseData.message);
        setshortURl("");
        return;
      }
      if (!responseData.data) return;
      setshortURl(
        `${import.meta.env.VITE_FRONTEND_URL}/${
          responseData.data.ShortURL as string
        }`
      );
    } catch (error: AxiosError | ApiResponse<ApiResponseCreateLink> | any) {
      if (isAxiosError(error)) {
        ToastFn(
          "error",
          "Error",
          error.response?.data.message || "Something went wrong"
        );
      }
      ToastFn("error", "Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" onSubmit={submitHandler}>
        <div>
          <label
            htmlFor="shorterURL-link"
            className="block mb-2 text-4xl font-bold text-black max-md:text-xl"
          >
            Paste your long link here
          </label>
          <Input
            type="text"
            id="shorterURL-link"
            placeholder="Enter you long link"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          variant={"default"}
          className="w-1/3 mx-auto max-md:w-full"
        >
          Generate Link
        </Button>
      </form>
      {isLoading && (
        <div className="mt-3 flex justify-center items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          Generating...
        </div>
      )}
      {shortURl && (
        <h1>
          <span>The shortURl is: </span>
          <a href={shortURl} className="text-blue-600 italic">
            {shortURl}
          </a>
          <Button
            variant={"link"}
            onClick={() => navigator.clipboard.writeText(shortURl)}
          >
            Copy link
          </Button>
        </h1>
      )}
    </div>
  );
};

export default LinkGenerator;
