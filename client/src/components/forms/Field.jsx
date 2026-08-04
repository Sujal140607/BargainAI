import Label from "../ui/Label";
import ErrorMessage from "../ui/ErrorMessage";

function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}

export default Field;
