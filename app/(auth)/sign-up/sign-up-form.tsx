"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react"; // ✅ this is allowed in client components

const SignUpForm = () => {
  const [formState, formAction] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // ✅ After successful signup, call signIn
  useEffect(() => {
    if (formState.success) {
      signIn("credentials", {
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });
    }
  }, [formState.success]);

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        setFormValues({ email, password }); // ✅ store these so we can use them in signIn()
      }}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <SignUpButton />
      </div>

      {formState && !formState.success && (
        <div role="alert" className="text-center text-destructive">
          {formState.message}
        </div>
      )}

      <div className="text-sm text-center text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/sign-in" target="_self" className="link">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
