"use client";

import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0F14] text-white">
      <AuthForm type="login" />
    </div>
  );
}