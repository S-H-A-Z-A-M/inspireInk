import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./container/Input";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { userApi } from "@/axios";
import OAuth from "./container/OAuth";

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
  // const [isSubmitting, setIsSubmitting] = useState(false); // To handle button state
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageChange = (value) => {
    const file = value[0]; // Get the selected file

    if (file) {
      // Create a FileReader to read the image file
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the image preview URL when reading is finished
        setImagePreview(reader.result);
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  };

  const create: SubmitHandler<SignupFormData> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.profilePic[0]);
    setError("");
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
    }
  };

  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (name === "profilePic") {
        if (value.profilePic[0]) {
          handleImageChange(value.profilePic);
        } else {
          setImagePreview(null);
        }
      }
    });
    return () => unsubscribe();
  }, [watch]);

  return (
    <div className="flex items-center justify-center mt-4 mb-5">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
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

        <OAuth />

        <p className=" mt-3 text-center text-base text-black/60">Or with</p>
        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <div className="text-red-500">{errors.name?.message}</div>
            )}
            <Input
              label="Username: "
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <div className="text-red-500">{errors.username?.message}</div>
            )}
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email?.message}</div>
            )}
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                validate: {
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                },
              })}
            />
            {errors.password && (
              <div className="text-red-500">{errors.password?.message}</div>
            )}
            <Input
              label="Profile Pic: "
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register("profilePic", {
                required: "Profile is required",
              })}
            />{" "}
            {errors.profilePic && (
              <div className="text-red-500">{errors.profilePic?.message}</div>
            )}
            {imagePreview && (
              <div className="mb-4 pl-4">
                {
                  <img
                    src={imagePreview}
                    style={{ maxHeight: "400px", maxWidth: "400px" }}
                    /* preview image function*/ alt=""
                  />
                }
              </div>
            )}
            <Button
              type="submit"
              variant={"outline"}
              className={
                !isSubmitting ? "w-full p-5" : "w-full bg-gray-400 p-5"
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Signup };
