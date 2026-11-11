"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeftIcon,
  CheckIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

type Step = "email" | "code" | "password";

const STEPS: { key: Step; label: string; icon: typeof EnvelopeIcon }[] = [
  { key: "email", label: "Email", icon: EnvelopeIcon },
  { key: "code", label: "Verify code", icon: ShieldCheckIcon },
  { key: "password", label: "New password", icon: KeyIcon },
];

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

async function post(url: string, body: unknown, method = "POST") {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) throw new Error(payload?.message ?? "Something went wrong");
  return payload;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = "Reset Password | FreshCart";
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  async function run(action: () => Promise<void>) {
    setError("");
    setLoading(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- step 1: send code ---------- */
  function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    run(async () => {
      await post("/api/password/forgot", { email });
      toast.add({
        type: "success",
        title: "Code sent",
        description: `We emailed a reset code to ${email}.`,
      });
      setCode(Array(CODE_LENGTH).fill(""));
      setCooldown(RESEND_SECONDS);
      setStep("code");
      setTimeout(() => codeRefs.current[0]?.focus(), 50);
    });
  }

  /* ---------- step 2: verify code ---------- */
  function setDigit(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setCode((c) => c.map((d, i) => (i === index ? "" : d)));
      return;
    }
    // Supports typing one digit or pasting the whole code.
    setCode((c) => {
      const next = [...c];
      digits.split("").forEach((d, offset) => {
        if (index + offset < CODE_LENGTH) next[index + offset] = d;
      });
      return next;
    });
    codeRefs.current[Math.min(index + digits.length, CODE_LENGTH - 1)]?.focus();
  }

  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const resetCode = code.join("");
    if (resetCode.length < CODE_LENGTH) {
      setError("Enter the full 6-digit code.");
      return;
    }
    run(async () => {
      await post("/api/password/verify", { resetCode });
      setStep("password");
    });
  }

  /* ---------- step 3: new password ---------- */
  const checks = [
    { ok: password.length >= 6, label: "At least 6 characters" },
    { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
    { ok: /\d/.test(password), label: "One number" },
  ];

  function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!checks.every((c) => c.ok)) {
      setError("Your password doesn't meet all the requirements.");
      return;
    }
    if (password !== rePassword) {
      setError("Passwords don't match.");
      return;
    }
    run(async () => {
      await post("/api/password/reset", { email, newPassword: password }, "PUT");
      toast.add({
        type: "success",
        title: "Password updated",
        description: "You're now signed in with your new password.",
      });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push(result?.ok ? "/" : "/LogIn");
    });
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            F
          </span>
          <span className="text-lg font-bold text-emerald-600">FreshCart</span>
        </div>

        {/* stepper */}
        <ol className="mb-8 flex items-center">
          {STEPS.map(({ key, label, icon: Icon }, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <li key={key} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition ${
                      done
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : current
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {done ? <CheckIcon className="size-5" /> : <Icon className="size-5" />}
                  </span>
                  <span className={`text-xs font-medium ${current || done ? "text-slate-800" : "text-slate-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className={`mx-2 mb-5 h-0.5 flex-1 rounded ${done ? "bg-emerald-600" : "bg-slate-200"}`} />
                )}
              </li>
            );
          })}
        </ol>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={sendCode} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Forgot your password?</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the email linked to your account and we&apos;ll send you a reset code.
              </p>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verifyCode} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Check your email</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the 6-digit code we sent to{" "}
                <span className="font-medium text-slate-700">{email}</span>.
              </p>
            </div>
            <div className="flex justify-between gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    codeRefs.current[i] = el;
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && i > 0) codeRefs.current[i - 1]?.focus();
                  }}
                  className="h-14 w-full min-w-0 rounded-lg border border-slate-200 text-center text-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
            <p className="text-center text-sm text-slate-500">
              Didn&apos;t get it?{" "}
              {cooldown > 0 ? (
                <span>Resend in {cooldown}s</span>
              ) : (
                <button type="button" onClick={() => sendCode()} disabled={loading} className="font-medium text-emerald-600 hover:underline">
                  Resend code
                </button>
              )}
              {" · "}
              <button type="button" onClick={() => { setStep("email"); setError(""); }} className="font-medium text-emerald-600 hover:underline">
                Change email
              </button>
            </p>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={resetPassword} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Create a new password</h1>
              <p className="mt-1 text-sm text-slate-500">Choose a strong password you haven&apos;t used before.</p>
            </div>
            {[
              { id: "password", label: "New Password", value: password, set: setPassword },
              { id: "rePassword", label: "Confirm Password", value: rePassword, set: setRePassword },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                <div className="relative">
                  <LockClosedIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id={field.id}
                    type={showPassword ? "text" : "password"}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="h-11 pr-10 pl-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>
            ))}
            <ul className="space-y-1.5 text-sm">
              {checks.map((c) => (
                <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-emerald-700" : "text-slate-400"}`}>
                  <CheckIcon className="size-4" /> {c.label}
                </li>
              ))}
              <li className={`flex items-center gap-2 ${rePassword && password === rePassword ? "text-emerald-700" : "text-slate-400"}`}>
                <CheckIcon className="size-4" /> Passwords match
              </li>
            </ul>
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </form>
        )}

        <Link href="/LogIn" className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600">
          <ArrowLeftIcon className="size-4" /> Back to sign in
        </Link>
      </div>
    </main>
  );
}
