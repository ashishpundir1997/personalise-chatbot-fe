"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { OtpVerification } from "@/components/auth/otp-verification";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = useState("");

  const handleSignupSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setMode("otp");
  };

  const handleOtpSuccess = () => {
    // Redirect to main chat page
    window.location.href = "/";
  };

  const handleLoginSuccess = () => {
    // Redirect to main chat page
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      {mode === "login" && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setMode("signup")}
        />
      )}
      {mode === "signup" && (
        <SignupForm
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
      {mode === "otp" && (
        <OtpVerification email={email} onSuccess={handleOtpSuccess} />
      )}
    </div>
  );
}
