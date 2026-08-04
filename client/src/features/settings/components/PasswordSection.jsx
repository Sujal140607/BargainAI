import { useState } from "react";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";
import Field from "../../../components/forms/Field";
import FormMessage from "../../../components/forms/FormMessage";
import { passwordSchema, getFieldErrors } from "../utils/validation";

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(null);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = passwordSchema.safeParse({ current, next, confirm });
    if (!result.success) {
      setFieldErrors(getFieldErrors(result));
      setMessage(null);
      return;
    }

    setFieldErrors({});
    setCurrent("");
    setNext("");
    setConfirm("");
    setMessage({
      type: "success",
      text: "Password updated. This is a demo — no real change was made.",
    });
  };

  return (
    <SectionCard title="Password">
      <form className="mt-4 space-y-5" onSubmit={handleSubmit} noValidate>
        <Field
          label="Current password"
          htmlFor="settings-current"
          error={fieldErrors.current}
        >
          <PasswordInput
            id="settings-current"
            autoComplete="current-password"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              clearFieldError("current");
            }}
            placeholder="••••••••"
          />
        </Field>

        <Field
          label="New password"
          htmlFor="settings-next"
          hint="At least 8 characters."
          error={fieldErrors.next}
        >
          <PasswordInput
            id="settings-next"
            autoComplete="new-password"
            value={next}
            onChange={(e) => {
              setNext(e.target.value);
              clearFieldError("next");
            }}
            placeholder="••••••••"
          />
        </Field>

        <Field
          label="Confirm new password"
          htmlFor="settings-confirm"
          error={fieldErrors.confirm}
        >
          <PasswordInput
            id="settings-confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              clearFieldError("confirm");
            }}
            placeholder="••••••••"
          />
        </Field>

        <div className="space-y-3">
          {message && <FormMessage type={message.type}>{message.text}</FormMessage>}
          <Button type="submit" className="w-auto px-6">
            Update password
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

export default PasswordSection;
