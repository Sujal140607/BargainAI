function Label({ htmlFor, className = "", children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 block text-sm font-medium text-neutral-300 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

export default Label;
