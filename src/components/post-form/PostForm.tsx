import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/container/Button";
import Input from "../container/Input";
import RTE from "../container/RTE";
// import Select from "../container/Select";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { blogApi } from "@/axios";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [imagePreview, setImagePreview] = useState(post?.image || "");

  const submit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content);
    if (data.image && data.image[0]) {
      formData.append("coverImage", data.image[0]);
    }

    try {
      let response;
      if (post) {
        response = await blogApi.patch(`/edit-blog/${post.slug}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await blogApi.post("/create-blog", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (response) {
        const slug = response.data.message.slug;
        if (slug) {
          navigate(`/blog/${slug}`);
        } else {
          console.error("Slug is missing in the response data.");
        }
      }
    } catch (error) {
      console.error(err);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);
  console.log(post);
  return (
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
        {post && (
          <div className="w-full mb-4">
            {<img src={post.coverImage} /* preview image function*/ alt="" />}
          </div>
        )}

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "undefined"}
          className="w-full"
        >
          {post ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
