"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UserPlusIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/app/_component/action/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Must be at least 8 characters with numbers and symbols")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
    rePassword: z.string().min(1, "Confirm your password"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

const benefits = [
  {
    icon: StarIcon,
    title: "Premium Quality",
    text: "Premium quality products sourced from trusted suppliers.",
  },
  {
    icon: TruckIcon,
    title: "Fast Delivery",
    text: "Same-day delivery available in most areas",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Shopping",
    text: "Your data and payments are completely secure",
  },
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { score: 0, label: "", color: "bg-slate-200" };
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-lime-500" };
  return { score: 4, label: "Strong", color: "bg-emerald-600" };
}

export default function SignupPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    document.title = "Create Your Account | FreshCart";
  }, []);

  async function onSubmit(values: SignupFormValues) {
    setApiError("");
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      rePassword: values.rePassword,
      phone: values.phone,
    };

    const result = await signUpUser(body);

    if (result?.message === "success") {
      router.push("/LogIn");
      toast.add({
        title: "Account Created",
        description: "Your account has been created successfully. Please log in to continue.",
      });
    } else {
      setApiError(
        result?.message || "Failed to create account. Please try again.",
      );
      toast.add({
        title: "Error",
        description: result?.message || "Failed to create account. Please try again."
      });
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <section className="hidden pt-6 lg:block">
          <h1 className="text-3xl font-bold text-slate-700">
            Welcome to <span className="text-emerald-600">FreshCart</span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Join thousands of happy customers who enjoy fresh groceries
            delivered right to their doorstep.
          </p>

          <div className="mt-8 space-y-5">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon className="size-4" />
                </span>
                <span>
                  <strong className="block text-sm text-slate-700">
                    {title}
                  </strong>
                  <span className="mt-0.5 block text-sm text-slate-500">
                    {text}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-md rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UserIcon className="size-4" />
              </span>
              <span className="text-sm font-medium text-slate-700">
                Sarah Johnson
              </span>
            </div>
            <div className="mt-2 flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="size-3.5" />
              ))}
            </div>
            <p className="mt-2 text-sm italic leading-5 text-slate-500">
              &quot;FreshCart has transformed my shopping experience. The
              quality of the products is outstanding, and the delivery is always
              on time. Highly recommend!&quot;
            </p>
          </div>
        </section>

        <section className="w-full rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-700">
                Create Your Account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Start your fresh journey with us today
              </p>
            </div>

            <div className="mt-6 flex flex-col  gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
                Sgin with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
                Sign with Facebook
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-600"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Ali"
                      className="h-10"
                      aria-invalid={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-600"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="ali@example.com"
                      className="h-10"
                      aria-invalid={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-600"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="create a strong password"
                      className="h-10"
                      aria-invalid={Boolean(errors.password)}
                    />
                  )}
                />
                {password && (
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Password strength</span>
                      <span
                        className={
                          strength.score <= 1
                            ? "text-red-500"
                            : strength.score === 2
                              ? "text-amber-500"
                              : "text-emerald-600"
                        }
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid h-1.5 grid-cols-4 gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={`rounded-full ${i < strength.score ? strength.color : "bg-slate-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-slate-400">
                  Must be at least 8 characters with numbers and symbols
                </p>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="rePassword"
                  className="mb-1.5 block text-sm font-medium text-slate-600"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="rePassword"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="rePassword"
                      type="password"
                      placeholder="confirm your password"
                      className="h-10"
                      aria-invalid={Boolean(errors.rePassword)}
                    />
                  )}
                />
                {errors.rePassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-slate-600"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="h-10"
                      aria-invalid={Boolean(errors.phone)}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {apiError && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {apiError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full gap-2 bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <UserPlusIcon className="size-4" />
                Create My Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/LogIn"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
