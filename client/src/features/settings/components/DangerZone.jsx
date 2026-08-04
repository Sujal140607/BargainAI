import { useState } from "react";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";
import FormMessage from "../../../components/forms/FormMessage";

function DangerRow({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
      </div>
      <Button
        variant="danger"
        className="w-auto px-4 sm:shrink-0"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function DangerZone() {
  const [message, setMessage] = useState(null);

  const handleReset = () => {
    if (
      window.confirm("Reset your negotiation history? This can't be undone.")
    ) {
      setMessage({
        type: "success",
        text: "Progress reset requested. Demo only — no data was changed.",
      });
    }
  };

  const handleDelete = () => {
    if (
      window.confirm("Delete your account permanently? This can't be undone.")
    ) {
      setMessage({
        type: "info",
        text: "Account deletion requested. Demo only — no account was deleted.",
      });
    }
  };

  return (
    <SectionCard title="Danger Zone" variant="danger">
      <div className="mt-2 divide-y divide-red-900/30">
        <DangerRow
          title="Reset progress"
          description="Clear your negotiation history and statistics."
          actionLabel="Reset"
          onAction={handleReset}
        />
        <DangerRow
          title="Delete account"
          description="Permanently remove your account and all data."
          actionLabel="Delete account"
          onAction={handleDelete}
        />
      </div>
      {message && <FormMessage type={message.type}>{message.text}</FormMessage>}
    </SectionCard>
  );
}

export default DangerZone;
