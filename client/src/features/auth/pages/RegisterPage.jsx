import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Label from "../../../components/ui/Label";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { clearError } from "../redux/authSlice";
import { registerSchema, getFieldErrors } from "../utils/validation";
import { getErrorMessage } from "../utils/getErrorMessage";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, isLoading, error } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "name") {
      setName(value);
    } else if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
    clearFieldError(field);
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setFieldErrors(getFieldErrors(result));
      return;
    }

    setFieldErrors({});

    try {
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });
    } catch {
      // error is exposed through the `error` state from useAuth
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
                onChange={handleChange("name")}
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
                onChange={handleChange("email")}
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
                onChange={handleChange("password")}
              />
              <ErrorMessage>{fieldErrors.password}</ErrorMessage>
            </div>

            <ErrorMessage>{getErrorMessage(error)}</ErrorMessage>

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
