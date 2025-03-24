import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

function RTE({ name, control, label, defaultValue = "" }: any) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              mobile: {
                menubar: true,
                plugins: "autosave lists autolink help",
                toolbar: "undo bold italic styles",
              },
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
                "codesample"
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "codesample | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              codesample_languages: [
                // Define supported languages
                { text: "JavaScript", value: "javascript" },
                { text: "HTML/XML", value: "markup" },
                { text: "CSS", value: "css" },
                { text: "Python", value: "python" },
                { text: "Java", value: "java" },
                { text: "C++", value: "cpp" },
              ],
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}

export default RTE;
