"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  changePassword,
  updateProfile,
} from "../action/profileAction/profile";
import { toast } from "@/components/ui/toast";
import TrustFeatures from "../TrustFeatures/TrustFeatures";

const sidebarLinks = [
  {
    name: "All Orders",
    href: "/allorders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "My Addresses",
    href: "/address",
    icon: MapPinIcon,
  },
  {
    name: "Settings",
    href: "/profile",
    icon: Cog6ToothIcon,
    active: true,
  },
];

export default function ProfileComp() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile({ name, email, phone });
      await update({ name, email });
      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your account information has been saved.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Could not update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    if (password !== rePassword) {
      toast.add({
        type: "error",
        title: "Passwords do not match",
        description: "New password and confirmation must be the same.",
      });
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, password, rePassword });
      setCurrentPassword("");
      setPassword("");
      setRePassword("");
      toast.add({
        type: "success",
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Change failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not change your password.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">My Account</li>
            </ol>
          </nav>
        </div>

        <section className="bg-emerald-600 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-full bg-white/15 text-white">
              <UserCircleIcon className="size-10" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="mt-1 text-emerald-50">
                Manage your addresses and account settings.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Account Menu
            </h2>
            <nav className="space-y-1">
              {sidebarLinks.map(({ name: label, href, icon: Icon, active }) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              href="/allorders"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <ClipboardDocumentListIcon className="size-5" />
              View All Orders
            </Link>
          </aside>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Account Settings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your profile information and change your password.
              </p>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-5 text-lg font-semibold text-slate-900">
                Profile Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-slate-700">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-slate-700">
                    Email Address
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-slate-700">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Account Information
              </h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">User ID</dt>
                  <dd className="mt-1 truncate font-medium text-slate-800">
                    {user?.id ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Role</dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircleIcon className="size-3.5" />
                      User
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-5 text-lg font-semibold text-slate-900">
                Change Password
              </h3>
              <div className="grid gap-4">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-slate-700">
                    Current Password
                  </span>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-slate-700">
                      New Password
                    </span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-slate-700">
                      Confirm New Password
                    </span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {savingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <TrustFeatures />
    </>
  );
}
