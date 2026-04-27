"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const endpoint =
      type === "login"
        ? `${backendUrl}/api/auth/login`
        : `${backendUrl}/api/auth/register`;

    const res = await fetch(endpoint, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push(returnUrl || "/dashboard");
    } else {
      alert(data.message || "Something went wrong");
    }

  };

  return (
    <div className="bg-[#1A1B23] p-8 rounded-2xl w-full max-w-md border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
      </h2>

      <div className="flex flex-col gap-4">
        {type === "register" && (
          <input
            type="text"
            placeholder="Full Name"
            className="bg-[#0F0F14] p-3 rounded-lg outline-none"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="bg-[#0F0F14] p-3 rounded-lg outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-[#0F0F14] p-3 rounded-lg outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-semibold"
        >
          {type === "login" ? "Login" : "Create Account"}
        </button>
      </div>

      <p className="text-sm text-gray-400 text-center mt-4">
        {type === "login" ? (
          <>
            Don’t have an account?{" "}
            <span
              className="text-purple-400 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Sign up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-purple-400 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </>
        )}
      </p>
    </div>
  );
}