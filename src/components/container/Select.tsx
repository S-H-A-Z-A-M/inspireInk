import React, { useId, forwardRef, SelectHTMLAttributes } from "react";

// Define the props interface
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[]; // Array of options to render
  label?: string; // Optional label
  className?: string; // Optional additional className
}

// Use forwardRef with generics for better type inference
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className = "", label, ...props },
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
      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white
          text-black outline-none focus:bg-gray-50
          duration-200 border border-gray-200 w-full ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
