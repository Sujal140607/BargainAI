import { useState } from "react";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";
import FormMessage from "../../../components/forms/FormMessage";

const THEMES = [
  { id: "dark", label: "Dark", preview: "bg-neutral-900" },
  { id: "light", label: "Light", preview: "bg-neutral-100" },
  {
    id: "system",
    label: "System",
    preview: "bg-gradient-to-r from-neutral-100 to-neutral-900",
  },
];

function ThemePreview({ preview }) {
  return (
    <div className={`h-16 w-full rounded-lg border border-neutral-700 ${preview}`}>
      <div className="flex h-full items-center justify-center gap-1.5">
        <span className="h-2.5 w-10 rounded-full bg-violet-400" />
        <span className="h-2.5 w-6 rounded-full bg-neutral-400" />
        <span className="h-2.5 w-8 rounded-full bg-neutral-400" />
      </div>
    </div>
  );
}

function ThemeSection() {
  const [theme, setTheme] = useState("dark");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const label = THEMES.find((option) => option.id === theme)?.label ?? theme;
    setMessage({
      type: "success",
      text: `Theme set to ${label}. Styling is demo-only for now.`,
    });
  };

  return (
    <SectionCard title="Theme">
      <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((option) => {
            const active = option.id === theme;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={active}
                className={`rounded-xl border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  active
                    ? "border-violet-500/70 bg-violet-950/30"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                }`}
              >
                <ThemePreview preview={option.preview} />
                <p
                  className={`mt-2 text-sm font-medium ${
                    active ? "text-violet-300" : "text-neutral-300"
                  }`}
                >
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {message && <FormMessage type={message.type}>{message.text}</FormMessage>}
          <Button type="submit" className="w-auto px-6">
            Apply theme
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

export default ThemeSection;
