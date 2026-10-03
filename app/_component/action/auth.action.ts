"use server"

import { API_BASE_URL } from "../Service/apiConfig";

type SignUpPayload = {
  name: string
  email: string
  password: string
  rePassword: string
  phone: string
}

export async function signUpUser(values: SignUpPayload) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    )
    const data = await response.json()
    return data
  } catch {
    return { message: "Something went wrong. Please try again." }
  }
}
