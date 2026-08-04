const TONES = {
  violet: "bg-violet-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

function ProgressBar({ value = 0, tone = "violet", className = "" }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-neutral-800 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${TONES[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
