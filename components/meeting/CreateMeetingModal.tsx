import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, AlignLeft, Video } from "lucide-react";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMeetingModal({
  isOpen,
  onClose,
}: CreateMeetingModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/meetings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, startTime }),
      });


      const data = await res.json();
      if (data.meeting && data.meeting[0]) {
        // If it's for now, redirect. If scheduled, just close.
        if (!startTime) {
          router.push(`/meet/${data.meeting[0].id}`);
        } else {
          onClose();
          // Optionally refresh dashboard meetings list
          window.location.reload(); 
        }
      }
    } catch (error) {
      console.error("Failed to create meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#1A1B23] border border-gray-800 p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Video size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Schedule Meeting
                </h2>
                <p className="text-gray-400 text-sm">
                  Set up your next collaboration session
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition shadow-inner"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-2">
                  <AlignLeft size={14} /> Description
                </label>
                <textarea
                  placeholder="Add meeting details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition shadow-inner h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-2">
                  <Calendar size={14} /> Scheduled Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition shadow-inner scheme-dark"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-800 text-gray-400 hover:bg-gray-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !title}
                  className="flex-2 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-purple-600/20"
                >
                  {loading ? "Creating..." : startTime ? "Schedule Meeting" : "Start Now"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

