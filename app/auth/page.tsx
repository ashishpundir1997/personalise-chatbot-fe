"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { OtpVerification } from "@/components/auth/otp-verification";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "otp" | "forgot-password" | "reset-password">("login");
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

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setMode("reset-password");
  };

  const handleResetPasswordSuccess = () => {
    // Redirect back to login after successful password reset
    setMode("login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      {mode === "login" && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setMode("signup")}
          onForgotPassword={() => setMode("forgot-password")}
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
      {mode === "forgot-password" && (
        <ForgotPasswordForm
          onSuccess={handleForgotPasswordSuccess}
          onBack={() => setMode("login")}
        />
      )}
      {mode === "reset-password" && (
        <ResetPasswordForm email={email} onSuccess={handleResetPasswordSuccess} />
      )}
    </div>
  );
}
