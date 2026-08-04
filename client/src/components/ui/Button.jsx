const VARIANTS = {
  primary:
    "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 focus:ring-violet-500/50",
  secondary:
    "border border-neutral-700 bg-neutral-800/60 text-neutral-200 hover:bg-neutral-800 focus:ring-neutral-500/30",
  danger:
    "border border-red-900/60 bg-red-600/15 text-red-300 hover:bg-red-600/25 focus:ring-red-500/40",
};

function Button({
  type = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
