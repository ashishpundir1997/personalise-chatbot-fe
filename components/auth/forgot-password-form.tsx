"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { usePasswordResetRequestMutation } from "@/store";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const [passwordResetRequest, { isLoading }] = usePasswordResetRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await passwordResetRequest({ email }).unwrap();
      console.log("Password reset request successful:", response);
      // Proceed to OTP verification with new password
      onSuccess(email);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err 
        ? (err.data as { message?: string })?.message || 'Request failed'
        : 'Request failed';
      setError(errorMessage);
      console.error("Password reset request error:", err);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </button>
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
