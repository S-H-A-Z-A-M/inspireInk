import React, { useId, forwardRef, InputHTMLAttributes } from "react";

// Define the props interface, extending InputHTMLAttributes to include standard input props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label text
  className?: string; // Optional custom class name
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 rounded-lg bg-white ☐ text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        type={type}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
