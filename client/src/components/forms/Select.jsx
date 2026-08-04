function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
