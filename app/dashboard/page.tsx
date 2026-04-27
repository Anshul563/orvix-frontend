"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateMeetingModal from "@/components/meeting/CreateMeetingModal";

interface Meeting {
  id: string;
  title: string;
  time: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 🔐 simple auth check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/meetings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMeetings(data);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      }
    };

    fetchMeetings();
  }, [router]);


  return (
    <div className="min-h-screen bg-[#0F0F14] text-white flex">
      {/* 🧭 SIDEBAR */}
      <aside className="w-64 bg-[#1A1B23] border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-400 mb-8">
            Orvix
          </h1>

          <nav className="flex flex-col gap-4 text-sm">
            <button className="text-left hover:text-purple-400">
              🏠 Dashboard
            </button>
            <button className="text-left hover:text-purple-400">
              📅 Meetings
            </button>
            <button className="text-left hover:text-purple-400">
              💬 Messages
            </button>
            <button className="text-left hover:text-purple-400">
              🤖 AI Assistant
            </button>
          </nav>
        </div>

        <div className="text-sm text-gray-400">
          👤 Anshul <br />
          <button
            className="mt-2 text-red-400"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 📊 MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            Welcome back 👋
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition shadow-lg shadow-purple-500/20"
            >
              ➕ New Meeting
            </button>

            <button
              onClick={() => router.push("/meet/demo")}
              className="border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              🔗 Join via Link
            </button>
          </div>
        </div>

        {/* 📅 UPCOMING MEETINGS */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Upcoming Meetings
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((m: any) => (
              <div
                key={m.id}
                className="bg-[#1A1B23] p-5 rounded-xl border border-gray-800 hover:border-purple-500 transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-purple-400 group-hover:text-purple-300 transition">
                    {m.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider ${
                    m.startTime ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                  }`}>
                    {m.startTime ? "Scheduled" : "Live"}
                  </span>
                </div>
                
                {m.description && (
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                    {m.description}
                  </p>
                )}

                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <span className="opacity-50">🕒</span> {m.startTime ? new Date(m.startTime).toLocaleString() : new Date(m.createdAt).toLocaleString()}
                </p>


                <button
                  onClick={() => router.push(`/meet/${m.id}`)}
                  className="w-full bg-gray-800/50 group-hover:bg-purple-600 py-2 rounded-lg text-sm font-medium transition"
                >
                  Join Meeting
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ⚡ ACTIVITY PANEL */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Recent Activity
          </h3>

          <div className="bg-[#1A1B23] p-6 rounded-xl border border-gray-800 text-sm text-gray-400 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p>Meeting summary generated for <span className="text-gray-200">Design Sync</span></p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <p>Recording uploaded to cloud</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <p>New messages in <span className="text-gray-200">Marketing</span> chat</p>
            </div>
          </div>
        </div>
      </main>

      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}