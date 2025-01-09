import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./container/Input";
import Button from "./container/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { userApi } from "@/axios";

interface SignupFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePic: FileList;
}

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle button state
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create: SubmitHandler<SignupFormData> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.profilePic[0]);
    setError("");
    setIsSubmitting(true); // Disable button during submission
    try {
      const response = await userApi.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(login(response.data.data));
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center mt-4">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        {/* <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div> */}
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Username: "
              placeholder="Enter your username"
              {...register("username", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Input
              label="Profile Pic: "
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register("profilePic", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Signup };
