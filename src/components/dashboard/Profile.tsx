import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { userFieldProfile } from "@/Types";
import validator from "validator";
import { useAppDispatch, useAppSelector } from "@/store/auth.store";
import ToastFn from "../Toaster";
import axiosInstance from "@/api/axiosInstance";
import { isAxiosError } from "axios";
import { login, User } from "@/slices/auth.slice";
const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [userfields, setUserFields] = React.useState<userFieldProfile>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isDisabled, setIsDisabled] = React.useState(true);
  useEffect(() => {
    setUserFields({
      first_name: user?.name?.split(" ")[0] || "",
      last_name: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
    });
  }, [user]);
  const [error, setError] = React.useState<userFieldProfile>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      setIsDisabled(false);
    }
    const { name, value } = event.target;
    setUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  const handleError = () => {
    if (!validator.trim(userfields.first_name)) {
      setError({
        ...error,
        first_name: "Enter your first name",
      });
      return true;
    }
    if (!validator.trim(userfields.last_name)) {
      setError({
        ...error,
        last_name: "Enter your last name",
      });
      return true;
    }
    if (!validator.isEmail(userfields.email)) {
      setError({
        ...error,
        email: "Enter a valid email",
      });
      return true;
    }
  };
  const clearError = () => {
    setError({
      first_name: "",
      last_name: "",
      email: "",
    });
  };
  const dispatch = useAppDispatch();
  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (handleError()) return;
    console.log(userfields);
    try {
      const { data } = await axiosInstance.put<{
        success: boolean;
        data: User;
        message: string;
      }>("/v1/auth/user/update", userfields);
      console.log(data);
      ToastFn("success", "Profile", data.message);
      dispatch(login(data));
      setIsDisabled(true);
    } catch (error) {
      if (isAxiosError(error)) {
        ToastFn("error", "Profile", error.response?.data.message);
        return;
      }
      ToastFn("error", "Profile", error?.message || "Something went wrong");
    }
  };
  return (
    <div>
      <h3 className="text-3xl font-bold my-4">Profile </h3>
      <form onSubmit={SubmitHandler}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name">First Name:</label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="Enter your first name"
              onChange={handleInputChange}
              value={userfields.first_name}
              className={error.first_name ? "border-red-500" : ""}
            />
            {error.first_name && (
              <span className="text-red-500 text-xs">{error.first_name}</span>
            )}
          </div>
          <div>
            <label htmlFor="last_name">Last Name:</label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Enter your last name"
              onChange={handleInputChange}
              value={userfields.last_name}
              className={error.last_name ? "border-red-500" : ""}
            />
            {error.last_name && (
              <span className="text-red-500 text-xs">{error.last_name}</span>
            )}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your Email"
              onChange={handleInputChange}
              value={userfields.email}
              className={error.email ? "border-red-500" : ""}
            />
            {error.email && (
              <span className="text-red-500 text-xs">{error.email}</span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          variant={"outline"}
          className="mt-4 bg-dark-bg-card"
          disabled={isDisabled}
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default Profile;
