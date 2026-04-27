"use client";

import { useMeetingStore } from "@/store/useMeetingStore";
import { X, User, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { motion } from "framer-motion";
import { socket } from "@/lib/socket";

export default function ParticipantsModal() {
  const { users, setParticipantsOpen } = useMeetingStore();
  const participantList = Object.entries(users);

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#1A1B23] border-l border-gray-800 z-50 flex flex-col shadow-2xl">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#1A1B23]/50 backdrop-blur-md sticky top-0">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Participants
          <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">
            {participantList.length}
          </span>
        </h3>
        <button
          onClick={() => setParticipantsOpen(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Others */}
        {participantList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
            <User size={32} className="opacity-20" />
            <p className="text-xs">Connecting...</p>
          </div>
        ) : (
          participantList.map(([id, user]: any) => {
            const isMe = id === socket.id;
            return (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={id}
                className={`flex items-center justify-between p-3 rounded-xl transition border ${
                  isMe 
                    ? "bg-purple-600/10 border-purple-500/20" 
                    : "hover:bg-gray-800/50 border-transparent hover:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase ${
                    isMe ? "bg-purple-600" : "bg-gray-800 border border-gray-700"
                  }`}>
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user.name} {isMe && "(You)"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.mic ? (
                    <Mic size={14} className="text-gray-400" />
                  ) : (
                    <MicOff size={14} className="text-red-500" />
                  )}
                  {user.camera ? (
                    <Video size={14} className="text-gray-400" />
                  ) : (
                    <VideoOff size={14} className="text-red-500" />
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      
      <div className="p-4 bg-gray-900/50 border-t border-gray-800">
         <button className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-semibold transition border border-gray-700">
            Mute All
         </button>
      </div>
    </div>
  );
}
