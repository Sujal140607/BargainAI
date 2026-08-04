const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

function Avatar({ name = "", src, size = "md", className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${SIZES[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-violet-600/30 font-bold text-violet-200 ${SIZES[size]} ${className}`}
      aria-hidden="true"
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default Avatar;
