"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  CheckIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [authError, setAuthError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    document.title = "Sign In | FreshCart";

    const queryError = new URLSearchParams(window.location.search).get("error");
    if (queryError) {
      const message =
        queryError === "Configuration"
          ? "There is a problem with the server configuration. Please contact support."
          : queryError === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : "Something went wrong while signing in.";
      setAuthError(message);
    }
  }, []);

  async function onSubmit(values: LoginFormValues) {
    setApiError("");
    const isLogin = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (isLogin?.ok) {
      router.push("/");
    } else {
      const errorMessage =
        isLogin?.error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : "Something went wrong while signing in. Please try again.";
      setApiError(errorMessage);
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
        <section className="hidden flex-col justify-center border-r border-slate-100 bg-linear-to-b from-white to-emerald-50/40 px-10 py-12 lg:flex">
          <div className="relative mx-auto h-56 w-full max-w-sm">
            <Image
              src="/images/sign.png"
              alt="Fresh groceries in a shopping cart"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold leading-snug text-slate-800">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-slate-500">
            Join thousands of happy customers who trust FreshCart for their
            daily grocery needs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-emerald-600" />
              Free Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-emerald-600" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-emerald-600" />
              24/7 Support
            </span>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                F
              </span>
              <span className="text-lg font-bold text-emerald-600">
                FreshCart
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">Welcome Back!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue your fresh shopping experience
            </p>

            {(apiError || authError) && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {apiError || authError}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-center gap-2 border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-center gap-2 border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
                Continue with Facebook
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                OR CONTINUE WITH EMAIL
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-11 pl-10"
                        aria-invalid={Boolean(errors.email)}
                      />
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgetPass"
                    className="text-sm font-medium text-emerald-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <LockClosedIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-10 pl-10"
                        aria-invalid={Boolean(errors.password)}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Controller
                  control={control}
                  name="remember"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={field.onChange}
                      className="size-4 rounded border-slate-300 accent-emerald-600"
                    />
                  )}
                />
                Keep me signed in
              </label>

              {apiError && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {apiError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New to FreshCart?{" "}
              <Link
                href="/SignUp"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheckIcon className="size-3" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1">
                <TruckIcon className="size-3" />
                50k+ Users
              </span>
              <span className="flex items-center gap-1">
                <StarIcon className="size-3" />
                4.5 Rating
              </span>
              <span className="flex items-center gap-1">
                <PhoneIcon className="size-3" />
                Support
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
