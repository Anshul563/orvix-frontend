"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-[#0F0F14] text-white min-h-screen">
      {/* 🔝 NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wide text-purple-400">
          Orvix
        </h1>

        <div className="flex gap-6 text-sm">
          <button className="hover:text-purple-400">Features</button>
          <button className="hover:text-purple-400">Pricing</button>
          <button className="hover:text-purple-400">Docs</button>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
        >
          Dashboard
        </button>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="flex flex-col items-center text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold max-w-3xl leading-tight"
        >
          Meetings that{" "}
          <span className="text-purple-500">think, adapt,</span> and{" "}
          <span className="text-blue-400">build with you</span>
        </motion.h1>

        <p className="text-gray-400 mt-6 max-w-xl">
          Orvix is a next-gen collaboration platform with real-time video,
          AI-powered insights, and built-in teamwork tools.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/meet/demo")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg"
          >
            Start Meeting
          </button>

          <button className="border border-gray-700 px-6 py-3 rounded-xl hover:bg-gray-800">
            Watch Demo
          </button>
        </div>
      </section>

      {/* 🎥 FEATURE SECTION */}
      <section className="grid md:grid-cols-3 gap-6 px-10 py-16">
        {[
          {
            title: "AI-Powered Meetings",
            desc: "Auto summaries, action items, and smart insights.",
          },
          {
            title: "Real-time Collaboration",
            desc: "Chat, screen share, and build together live.",
          },
          {
            title: "Low Bandwidth Mode",
            desc: "Works smoothly even on weak internet.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-[#1A1B23] p-6 rounded-2xl border border-gray-800 hover:border-purple-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-purple-400">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* ⚡ LIVE EXPERIENCE SECTION */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Built for modern teams 🚀
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          From developers to creators, Orvix helps teams communicate,
          collaborate, and create—all in one place.
        </p>
      </section>

      {/* 💬 CTA SECTION */}
      <section className="text-center py-16 bg-linear-to-r from-purple-600 to-blue-500">
        <h2 className="text-3xl font-bold mb-4">
          Ready to upgrade your meetings?
        </h2>

        <button
          onClick={() => router.push("/meet/demo")}
          className="bg-black text-white px-6 py-3 rounded-xl mt-4 hover:bg-gray-900"
        >
          Try Orvix Now
        </button>
      </section>

      {/* 🔻 FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Orvix. All rights reserved.
      </footer>
    </main>
  );
}