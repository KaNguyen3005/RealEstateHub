"use server";

import { requireBackendApiUrl } from "@/lib/server-env";
import { contactRequestSchema, type ContactRequestValues } from "@/lib/validations/contact.schema";
import type { ApiResponse } from "@/types/api";

export interface ContactRequestActionState {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactRequestValues, string[]>>;
}

function readFormValue(formData: FormData, key: keyof ContactRequestValues | "accessToken") {
  return String(formData.get(key) ?? "").trim();
}

async function parseBackendResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as ApiResponse<T>;
}

export async function submitContactRequest(
  _previousState: ContactRequestActionState,
  formData: FormData
): Promise<ContactRequestActionState> {
  const rawData = {
    propertyId: readFormValue(formData, "propertyId"),
    name: readFormValue(formData, "name"),
    email: readFormValue(formData, "email"),
    phone: readFormValue(formData, "phone"),
    message: readFormValue(formData, "message"),
  };
  const accessToken = readFormValue(formData, "accessToken");
  const validationResult = contactRequestSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please check the contact form and try again.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(`${requireBackendApiUrl()}/api/contact-requests`, {
      method: "POST",
      headers,
      body: JSON.stringify(validationResult.data),
      cache: "no-store",
    });
    const payload = await parseBackendResponse<{ _id: string; status: string }>(response);

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message ?? "Contact request could not be submitted.",
      };
    }

    return {
      success: true,
      message: payload?.message ?? "Contact request submitted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Contact request could not be submitted.",
    };
  }
}
