import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../service/store/store";
import { useState } from "react";
import { registerUser } from "../../service/features/authSlice";

type FormRegisterProps = {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const FormRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormRegisterProps>({
    defaultValues: {
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { register, handleSubmit, formState, reset, watch } = form;
  const { errors } = formState;

  const onSubmit = (data: FormRegisterProps) => {
    const { username, name, password } = data; // Extract necessary fields
    setIsLoading(true);
    dispatch(registerUser({ username, name, password }))
      .unwrap()
      .then((response) => {
        if (response) {
          reset({
            name: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
          setIsLoading(false);
          navigate("/login");
        } else {
          console.error("Registration failed: Response data is undefined");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-8 px-4 sm:px-0">
      {/* header title form */}
      <div className="flex flex-col items-center text-center">
        <h1 className="sm:h-20 w-full text-3xl">Mommilk</h1>
        <h3 className="text-2xl sm:text-4xl font-bold mt-4">Register</h3>
      </div>
      <form
        autoComplete="off"
        className="w-full sm:w-80"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <div className="flex flex-row">
            <label htmlFor="username" className="text-base font-semibold">
              Username:
            </label>
            {errors.username && (
              <p className="text-sm text-red-500">* {errors.username.message}</p>
            )}
          </div>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username..."
            className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <label htmlFor="name" className="text-base font-semibold">
              Name:
            </label>
            {errors.name && (
              <p className="text-sm text-red-500">* {errors.name.message}</p>
            )}
          </div>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            id="name"
            name="name"
            placeholder="Enter your Name..."
            className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
          />
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row">
            <label htmlFor="password" className="text-base font-semibold">
              Password:{" "}
            </label>
            {errors.password && (
              <p className="text-sm text-red-500">*{errors.password.message}</p>
            )}
          </div>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password..."
            className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
          />
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row">
            <label htmlFor="confirmPassword" className="text-base font-semibold">
              Confirm Password:{" "}
            </label>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">*{errors.confirmPassword.message}</p>
            )}
          </div>
          <input
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password..."
            className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center mt-4 w-full sm:w-80 gap-12">
          <button
            type="submit"
            className="bg-pink-200 p-3 rounded-xl text-black font-bold hover:bg-pink-600 cursor-pointer w-full"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
      <Link
        to={"/login"}
        className="text-blue-600 underline font-normal text-base mt-2 sm:mt-0"
      >
        Do you have account? Login
      </Link>
    </div>
  );
};

export default FormRegister;
