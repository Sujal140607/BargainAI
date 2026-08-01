import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${className}`}
      {...props}
    />
  );
});

export default Input;
