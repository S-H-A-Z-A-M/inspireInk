import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Input from "../container/Input";
import RTE from "../container/RTE";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { blogApi } from "@/axios";

function PostForm({ post }: any) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.auth.userData);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (value: any) => {
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
  const submit = async (data: any) => {
    try {
      let payload;

      payload = new FormData();
      payload.append("title", data.title);
      payload.append("slug", data.slug);
      payload.append("content", data.content);
      payload.append("coverImage", data.image[0]);
      let headers = { "Content-Type": "multipart/form-data" };
      let response;
      if (post) {
        response = await blogApi.patch(`/edit-blog/${post.slug}`, payload, {
          headers,
        });
      } else {
        response = await blogApi.post("/create-blog", payload, { headers });
      }

      // Handle response and navigation
      if (response) {
        const slug = response.data.message.slug;
        if (slug) {
          navigate(`/blog/${slug}`);
        } else {
          console.error("Slug is missing in the response data.");
        }
      }
    } catch (err) {
      console.error("Error submitting the blog:", err);
    }
  };

  const slugTransform = useCallback((value: any) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }: any) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
      if (name === "image") {
        if (value.image[0]) {
          handleImageChange(value.image);
        } else {
          setImagePreview(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);
  // console.log(post);
  return (
    <div className="flex items-center  min-h-screen justify-center">
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2 ">
          <Input
            label="Title"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug"
            placeholder="Slug"
            className="mb-4"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
        <div>
          <Input
            label="Cover Image"
            type="file"
            className="mb-4"
            accept="image/png,image/jpg,image/jpeg"
            {...register("image", { required: !post })}
          />
          {(imagePreview || post) && (
            <div className="mb-4 flex justify-center">
              {
                <img
                  src={imagePreview || post.coverImage}
                  style={{ maxHeight: "450px", maxWidth: "450px" }}
                  /* preview image function*/ alt=""
                />
              }
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
          >
            {post ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
