import { useState } from "react";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";
import Toggle from "../../../components/forms/Toggle";
import FormMessage from "../../../components/forms/FormMessage";

const OPTIONS = [
  {
    id: "offers",
    label: "New offers",
    description: "Notify me when a seller counters my offer",
    checked: true,
  },
  {
    id: "deals",
    label: "Deal alerts",
    description: "Big discounts on products I'm watching",
    checked: true,
  },
  {
    id: "rank",
    label: "Leaderboard updates",
    description: "When my global rank changes",
    checked: false,
  },
  {
    id: "summary",
    label: "Weekly summary",
    description: "A recap of my bargaining week",
    checked: true,
  },
];

function NotificationsSection() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(OPTIONS.map((option) => [option.id, option.checked]))
  );
  const [message, setMessage] = useState(null);

  const toggle = (id) => {
    setValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({
      type: "success",
      text: "Notification preferences saved.",
    });
  };

  return (
    <SectionCard title="Notifications">
      <form className="mt-2" onSubmit={handleSubmit}>
        <div className="divide-y divide-neutral-800">
          {OPTIONS.map((option) => (
            <Toggle
              key={option.id}
              label={option.label}
              description={option.description}
              checked={values[option.id]}
              onChange={() => toggle(option.id)}
            />
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {message && <FormMessage type={message.type}>{message.text}</FormMessage>}
          <Button type="submit" className="w-auto px-6">
            Save preferences
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

export default NotificationsSection;
