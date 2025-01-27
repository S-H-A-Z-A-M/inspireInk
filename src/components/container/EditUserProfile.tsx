import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { userApi } from "@/axios";
import { login } from "@/store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function EditUserProfile() {
  const userData = useSelector((state) => state.auth.userData);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateUserProfile = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("about", data.bio);
    if (data.image && data.image[0]) {
      formData.append("avatar", data.image[0]);
    }

    try {
      const response = await userApi.patch("/edit-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(login(response.data.data));
      navigate(`/users/${response.data.data.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const { handleSubmit, watch, register } = useForm({
    defaultValues: {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      bio: userData.about || "",
    },
  });

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
    <div className="flex items-center justify-center mt-36">
      <div className="max-w-[40rem]">
        <h1 className="text-3xl font-bold mb-2">User</h1>
        <form
          className="ml-2 border p-4 bg-gray-50"
          onSubmit={handleSubmit(updateUserProfile)}
        >
          <Input
            label="Name"
            {...register("name", {
              required: true,
            })}
          />
          <Input
            label="Email"
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
            label="Username"
            {...register("username", {
              required: true,
            })}
          />
          <Input
            label="Profile Image"
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            {...register("profilePic", {})}
          />
          {imagePreview && (
            <div>
              {
                <img
                  src={imagePreview}
                  style={{ maxHeight: "400px", maxWidth: "400px" }}
                  /* preview image function*/ alt=""
                />
              }
            </div>
          )}

          <Input
            label="Bio"
            placeholder="A short bio..."
            {...register("bio", {
              // required: true,
            })}
          />
          <Button type="submit" className="w-full mt-4">
            Update Profile
          </Button>
          <Button variant={"outline"} className="w-full mt-4">
            <Link to={`/users/${userData.username}`}>Cancel</Link>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditUserProfile;
