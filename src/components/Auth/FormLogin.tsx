import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../../service/features/authSlice";
import { useAppDispatch } from "../../service/store/store";
import { toast } from "react-toastify";

type FormLoginValues = {
  username: string;
  password: string;
};

const FormLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormLoginValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: FormLoginValues) => {
    setIsLoading(true);
    dispatch(loginUser(data))
      .unwrap()
      .then((response) => {
        localStorage.setItem("customerId", response.user.id)
        const role = response.user.role;
        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else if (role === "Staff") {
          navigate("/product-management");
        } else if (role === "Customer") {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="flex flex-col items-center mt-10 gap-8 px-4 sm:px-0">
      {/* header title form */}
      <div className="flex flex-col items-center text-center">
        <h1 className="sm:h-20 w-full text-3xl">Mommilk</h1>
        <h3 className="text-2xl sm:text-4xl font-bold mt-4">Login</h3>
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
            id="username"
            name="username"
            placeholder="Enter your username..."
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
        <div className="flex flex-col sm:flex-row items-center mt-4 w-full sm:w-80 gap-12 justify-center">
          <button
            type="submit"
            className="bg-pink-200 p-3 rounded-xl text-black font-bold hover:bg-pink-600 cursor-pointer w-full sm:w-48 "
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          
        </div>
      </form>
      <Link
        to={"/register"}
        className="text-blue-600 underline font-normal text-base mt-2 sm:mt-0"
      >
        Do you not have account? Register Now
      </Link>
    </div>
  );
};

export default FormLogin;
