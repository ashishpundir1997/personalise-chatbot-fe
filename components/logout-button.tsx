"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/store";
import { useState } from "react";

export function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    try {
      await logout().unwrap();
      console.log("Logout successful");
      // Redirect to auth page
      window.location.href = "/auth";
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err 
        ? (err.data as { message?: string })?.message || 'Logout failed'
        : 'Logout failed';
      setError(errorMessage);
      console.error("Logout error:", err);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        disabled={isLoading}
        className="cursor-pointer"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}
