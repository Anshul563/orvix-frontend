"use client";

import { useEffect, use } from "react";
import { socket } from "@/lib/socket";
import { useMeetingStore } from "@/store/useMeetingStore";
import VideoGrid from "@/components/meeting/VideoGrid";
import Controls from "@/components/controls/Controls";
import ChatPanel from "@/components/chat/ChatPanel";
import ParticipantsModal from "@/components/meeting/ParticipantsModal";
import { motion, AnimatePresence } from "framer-motion";
import { mediasoupManager } from "@/lib/mediasoup";

import { useRouter } from "next/navigation";

export default function MeetingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const { roomId } = use(params);

  const { 
    setUsers, 
    addMessage, 
    setRole, 
    isChatOpen, 
    isParticipantsOpen,
    addRemoteStream 
  } = useMeetingStore();



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?returnUrl=/meet/${roomId}`);
      return;
    }

    // 🔥 Decode token for name and userId
    let userId = socket.id;
    let name = "Guest";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
      name = payload.name || payload.email?.split("@")[0] || "User";
    } catch (e) {
      console.warn("Could not decode token", e);
    }

    socket.connect();
    socket.emit("join-room", { roomId, userId, name });


    socket.on("router-rtp-capabilities", async (caps) => {
      await mediasoupManager.init(caps);
    });

    socket.on("new-producer", async ({ producerId, socketId }) => {
      const consumer: any = await mediasoupManager.consume(producerId);
      const stream = new MediaStream([consumer.track]);
      addRemoteStream(socketId, stream);
    });

    socket.on("room-users", (usersMap) => {
      setUsers(usersMap);
    });


    socket.on("user-joined", ({ userId }) => {
      console.log("User joined:", userId);
    });

    socket.on("chat-message", (data) => {
      addMessage(data);
    });

    socket.on("role-assigned", ({ role }) => {
      setRole(role);
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("chat-message");
      socket.off("role-assigned");
      socket.disconnect();
    };
  }, [roomId, setUsers, addMessage, setRole]);

  return (
    <div className="flex h-screen bg-[#0F0F14] text-white overflow-hidden">
      <div className="flex-1 flex flex-col relative">
        <VideoGrid />
        <Controls />
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="z-50"
          >
            <ChatPanel />
          </motion.div>
        )}

        {isParticipantsOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="z-50"
          >
            <ParticipantsModal />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
