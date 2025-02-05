import { Link, useNavigate } from "react-router-dom";
import Input from "./container/Input";
import { Button } from "./ui/button.tsx";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as authLogin } from "@/store/authSlice";
import { userApi } from "../axios.ts";
import OAuth from "./container/OAuth.tsx";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const login = async (data: any) => {
    try {
      const response = await userApi.post("/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);
      dispatch(authLogin(response.data.data.user));
      navigate("/");
    } catch (error: any) {
      console.log("the error ::::::", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;

        if (status === 401 && message === "Invalid user credentials") {
          setError("root", { message: "Password is Incorrect" });
        } else if (status === 404 && message === "User not found") {
          setError("root", { message: "User does not exist." });
        } else {
          setError("root", {
            message: "Something went wrong. Please try again.",
          });
        }
      } else {
        setError("root", {
          message: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full mb-4">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit(login)} className="mt-5" noValidate>
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {typeof errors.email?.message === "string" && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: { value: true, message: "password is required" },
              })}
            />
            {typeof errors.password?.message === "string" && (
              <div className="text-red-500">{errors.password?.message}</div>
            )}

            {errors.root && (
              <div className="text-red-500">{errors.root?.message}</div>
            )}
            <Button
              disabled={isSubmitting}
              variant={"outline"}
              type="submit"
              className={!isSubmitting ? "w-full" : "w-full bg-gray-400"}
            >
              Sign in
            </Button>
          </div>
        </form>
        <p className=" mt-7 text-center text-base text-black/60">Or with</p>
        <OAuth />
        <p className="mt-4 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export { Login };
