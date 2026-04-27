import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0F14] text-white">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <AuthForm type="register" />
      </Suspense>
    </div>
  );
}