const STYLES = {
  success: "border-emerald-800 bg-emerald-950/40 text-emerald-300",
  error: "border-red-800 bg-red-950/40 text-red-300",
  info: "border-neutral-700 bg-neutral-900/60 text-neutral-300",
};

function FormMessage({ type = "success", children }) {
  if (!children) {
    return null;
  }

  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-xs font-medium ${STYLES[type]}`}
    >
      {children}
    </p>
  );
}

export default FormMessage;
