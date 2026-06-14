"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Send } from "lucide-react";

import {
  type ContactRequestActionState,
  submitContactRequest,
} from "@/app/properties/[id]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

interface ContactRequestFormProps {
  propertyId: string;
  disabled?: boolean;
}

const initialContactRequestState: ContactRequestActionState = {
  success: false,
  message: "",
};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} className="w-full sm:w-auto">
      <Send className="h-4 w-4" />
      {pending ? "Sending..." : "Send request"}
    </Button>
  );
}

function firstError(errors?: string[]) {
  return errors?.[0] ?? null;
}

export function ContactRequestForm({ propertyId, disabled = false }: ContactRequestFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useFormState(submitContactRequest, initialContactRequestState);
  const user = useAuthStore((store) => store.user);
  const accessToken = useAuthStore((store) => store.accessToken);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm">
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="accessToken" value={accessToken ?? ""} />

      <div>
        <h2 className="text-xl font-semibold text-foreground">Contact seller</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Send your contact details and question to the seller. Guests can submit this form too.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            defaultValue={user?.fullName ?? ""}
            disabled={disabled}
            className="mt-2"
          />
          {firstError(state.fieldErrors?.name) ? (
            <p className="mt-2 text-sm text-destructive">{firstError(state.fieldErrors?.name)}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            defaultValue={user?.email ?? ""}
            disabled={disabled}
            className="mt-2"
          />
          {firstError(state.fieldErrors?.email) ? (
            <p className="mt-2 text-sm text-destructive">{firstError(state.fieldErrors?.email)}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            name="phone"
            defaultValue={user?.phone ?? ""}
            disabled={disabled}
            className="mt-2"
          />
          {firstError(state.fieldErrors?.phone) ? (
            <p className="mt-2 text-sm text-destructive">{firstError(state.fieldErrors?.phone)}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contact-message">Message</Label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            disabled={disabled}
            placeholder="I am interested in this property. Please contact me with more details."
            className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {firstError(state.fieldErrors?.message) ? (
            <p className="mt-2 text-sm text-destructive">{firstError(state.fieldErrors?.message)}</p>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <div className={state.success ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"}>
          {state.message}
        </div>
      ) : null}

      <SubmitButton disabled={disabled} />
    </form>
  );
}
