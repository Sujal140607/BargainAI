import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Label from "../../../components/ui/Label";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useLoginMutation } from "../services/authApi";
import { setCredentials } from "../redux/authSlice";
import { loginSchema, getFieldErrors } from "../utils/validation";

function getErrorMessage(error) {
  return error?.data?.message || "Something went wrong. Please try again.";
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(getFieldErrors(result));
      return;
    }

    setFieldErrors({});

    try {
      const loginResult = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: loginResult.data.user,
          accessToken: loginResult.data.accessToken,
        })
      );
      navigate("/dashboard", { replace: true });
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to continue bargaining
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                autoComplete="current-password"
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-violet-400 transition hover:text-violet-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
