import { useState } from "react";
import Button from "../../../components/ui/Button";

function OfferInput({ onSend, isSubmitting, disabled }) {
  const [value, setValue] = useState("");

  const parsed = Number(value);
  const hasError =
    value.trim() !== "" && (!Number.isFinite(parsed) || parsed <= 0);
  const isDisabled = disabled || isSubmitting || hasError || value.trim() === "";

  const handleSend = () => {
    if (isDisabled) {
      return;
    }
    onSend(parsed);
    setValue("");
  };

  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-neutral-500">
            $
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Your offer"
            disabled={disabled || isSubmitting}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-2.5 pr-4 pl-9 text-sm text-white placeholder-neutral-500 transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        {hasError && (
          <p className="mt-1.5 text-xs text-red-400">Enter a valid amount.</p>
        )}
      </div>

      <Button
        className="w-auto px-6"
        onClick={handleSend}
        disabled={isDisabled}
      >
        {isSubmitting ? "Sending…" : "Send"}
      </Button>
    </div>
  );
}

export default OfferInput;
