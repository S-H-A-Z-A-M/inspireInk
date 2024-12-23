import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/container/Button";
import Input from "../container/Input";
import RTE from "../container/RTE";
import Select from "../container/Select";
import { useSelector, UseSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const submit = async (data) => {
    if(post){
      // update the post
      // update the file
      // delete previous file
      // then navigate the user to post page
    }else{
      // save the post
      // upload the file
      // then navigate the user to post page
      
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
    watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
  }, [watch, slugTransform, setValue]);
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
            {<img src="" /* preview image function*/ alt="" />}
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
