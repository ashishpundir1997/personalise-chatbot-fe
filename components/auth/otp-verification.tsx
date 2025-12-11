"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { useVerifyEmailMutation } from "@/store";

interface OtpVerificationProps {
  email: string;
  onSuccess: () => void;
}

export function OtpVerification({ email, onSuccess }: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d+$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      const response = await verifyEmail({ email, otp: otpValue }).unwrap();
      console.log("Email verified successfully:", response);
      // Token is automatically saved in authApi
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err 
        ? (err.data as { message?: string })?.message || 'Verification failed'
        : 'Verification failed';
      setError(errorMessage);
      console.error("Verification error:", err);
    }
  };

  const handleResendOtp = async () => {
    console.log("Resending OTP to:", email);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // TODO: Implement resend OTP API if needed
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent a 6-digit code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold"
                required
              />
            ))}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Didn&apos;t receive the code?{" "}
              <span className="font-medium">Resend OTP</span>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
