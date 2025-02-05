import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Input from "../container/Input";
import RTE from "../container/RTE";
import { useNavigate } from "react-router-dom";
import { blogApi } from "@/axios";

function PostForm({ post }: any) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      image: undefined,
    },
  });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (value: FileList | null) => {
    if (!value || value.length === 0) {
      setImagePreview(null);
      return;
    }

    const file = value[0]; // ✅ Now safely handles empty/null values
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
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
    } catch (err: any) {
      const message = err.response.data.message;
      if (message === "Blog already exists") {
        setError("title", { message: "Title is already taken." });
      }
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

  useEffect(() => {
    const subscription = watch((value, { name }: any) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
      if (name === "image") {
        if (value.image && value.image[0]) {
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
    <div className="flex items-center min-h-screen justify-center">
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-full mx-2 lg:mx-96 ">
          <Input
            label="Title"
            placeholder="Title"
            className="mb-1"
            {...register("title", { required: "Title is required" })}
          />
          {typeof errors.title?.message === "string" && (
            <div className="text-red-500">{errors.title?.message}</div>
          )}
          <Input
            label="Slug"
            placeholder="Slug"
            className="mb-1"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          {typeof errors.slug?.message === "string" && (
            <div className="text-red-500">{errors.slug?.message}</div>
          )}
          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
          <Input
            label="Cover Image"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            {...register("image", {
              required: { value: !post, message: "Image is requried" },
            })}
          />
          {typeof errors.image?.message === "string" && (
            <div className="text-red-500 mb-4">{errors.image?.message}</div>
          )}
          {(imagePreview || post) && (
            <div className="mb-4 flex justify-center">
              {
                <img
                  src={imagePreview || post.coverImage}
                  className="w-full lg:w-1/2 p-2"
                  alt=""
                />
              }
            </div>
          )}
          <Button
            disabled={isSubmitting}
            variant={"default"}
            type="submit"
            className={!isSubmitting ? "w-full" : "w-full bg-gray-400"}
          >
            {post ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
