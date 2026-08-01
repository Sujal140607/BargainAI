import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Label from "../../../components/ui/Label";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useRegisterMutation } from "../services/authApi";
import { registerSchema, getFieldErrors } from "../utils/validation";

function getErrorMessage(error) {
  return error?.data?.message || "Something went wrong. Please try again.";
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setFieldErrors(getFieldErrors(result));
      return;
    }

    setFieldErrors({});

    try {
      const registerResult = await register({
        name,
        email,
        password,
      }).unwrap();
      setSuccessMessage(
        `Account created successfully${
          registerResult?.data?.user?.name
            ? `, welcome ${registerResult.data.user.name}`
            : ""
        }`
      );
    } catch {
      // error is exposed through the mutation's `error` field
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Start bargaining on BargainAI
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
              />
              <ErrorMessage>{fieldErrors.name}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
              />
              <ErrorMessage>{fieldErrors.email}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
              />
              <ErrorMessage>{fieldErrors.password}</ErrorMessage>
            </div>

            <ErrorMessage>{error && getErrorMessage(error)}</ErrorMessage>

            {successMessage && (
              <p className="rounded-lg border border-emerald-800 bg-emerald-900/40 px-4 py-2.5 text-sm text-emerald-300">
                {successMessage}
              </p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-violet-400 transition hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
