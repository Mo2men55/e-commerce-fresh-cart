"use server";

import { getTokenFun } from "@/app/_utilites/getToken";

export async function updateProfile(data: {
  name: string;
  email: string;
  phone: string;
}) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/updateMe/`,
    {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Failed to update profile");
  }

  return payload;
}

export async function changePassword(data: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`,
    {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Failed to change password");
  }

  return payload;
}
