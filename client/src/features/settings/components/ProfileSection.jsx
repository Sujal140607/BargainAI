import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import SectionCard from "../../../components/ui/SectionCard";
import Field from "../../../components/forms/Field";
import FormMessage from "../../../components/forms/FormMessage";
import { profileSchema, getFieldErrors } from "../utils/validation";

function ProfileSection({ user }) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(null);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = profileSchema.safeParse({ name, email, avatar });
    if (!result.success) {
      setFieldErrors(getFieldErrors(result));
      setMessage(null);
      return;
    }

    setFieldErrors({});
    setMessage({
      type: "success",
      text: "Profile updated. Changes are kept locally for this demo.",
    });
  };

  return (
    <SectionCard title="Profile">
      <form className="mt-4 space-y-5" onSubmit={handleSubmit} noValidate>
        <Field
          label="Display name"
          htmlFor="settings-name"
          error={fieldErrors.name}
        >
          <Input
            id="settings-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            placeholder="Your name"
          />
        </Field>

        <Field
          label="Email"
          htmlFor="settings-email"
          error={fieldErrors.email}
        >
          <Input
            id="settings-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            placeholder="you@example.com"
          />
        </Field>

        <Field
          label="Avatar URL"
          htmlFor="settings-avatar"
          hint="Paste an image link to set a custom avatar."
          error={fieldErrors.avatar}
        >
          <Input
            id="settings-avatar"
            value={avatar}
            onChange={(e) => {
              setAvatar(e.target.value);
              clearFieldError("avatar");
            }}
            placeholder="https://…"
          />
        </Field>

        <div className="space-y-3">
          {message && <FormMessage type={message.type}>{message.text}</FormMessage>}
          <Button type="submit" className="w-auto px-6">
            Save changes
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

export default ProfileSection;
