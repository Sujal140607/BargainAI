const VARIANTS = {
  default: "border-neutral-800 bg-neutral-900/60",
  danger: "border-red-900/60 bg-red-950/10",
};

function SectionCard({
  title,
  action,
  variant = "default",
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${VARIANTS[variant]} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-4">
          {title && (
            <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default SectionCard;
