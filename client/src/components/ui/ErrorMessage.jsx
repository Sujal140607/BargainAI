function ErrorMessage({ className = "", children, ...props }) {
  if (!children) {
    return null;
  }

  return (
    <p
      role="alert"
      className={`mt-1.5 text-sm text-red-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export default ErrorMessage;
