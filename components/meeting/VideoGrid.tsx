import { useMeetingStore } from "@/store/useMeetingStore";
import { Mic, MicOff, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

function VideoCard({ stream, name, isSpeaking, isMuted, isMe }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initial = name?.charAt(0) || "U";

  return (
    <div
      className={`relative bg-[#1A1B23] rounded-3xl overflow-hidden border transition-all duration-500 ${
        isSpeaking
          ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-[1.01]"
          : "border-gray-800/50 hover:border-gray-700"
      }`}
    >
      {/* Video Placeholder / Avatar */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#0F0F14]">
        {!stream && (
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl ${
            isMe ? "bg-purple-600" : "bg-gray-800 border border-gray-700"
          }`}>
            {initial}
          </div>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMe} // Always mute self video element
        className={`relative w-full h-full object-cover transition-opacity duration-700 ${stream ? "opacity-100" : "opacity-0"}`}
      />

      {/* User Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5 shadow-2xl">
          <span className="text-[11px] font-bold text-white tracking-wide">
            {name} {isMe && "(You)"}
          </span>
          <div className="w-px h-3 bg-white/20 mx-1" />
          {!isMuted ? (
            <Mic size={12} className="text-white opacity-80" />
          ) : (
            <MicOff size={12} className="text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoGrid() {
  const { users, activeSpeaker, localStream, remoteStreams } = useMeetingStore();
  const [myName, setMyName] = useState("You");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setMyName(payload.name || payload.email?.split("@")[0] || "You");
      } catch (e) {}
    }
  }, []);

  const remoteParticipants = Object.entries(users).filter(([id]) => id !== socket.id);

  return (
    <div className="flex-1 p-6 flex items-center justify-center bg-[#0F0F14]">
      <div className={`grid gap-6 w-full max-w-7xl h-full max-h-[85vh] ${
        remoteParticipants.length === 0 
          ? "grid-cols-1 max-w-3xl aspect-video" 
          : remoteParticipants.length === 1 
            ? "grid-cols-2" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      }`}>
        {/* Local Video */}
        <VideoCard
          stream={localStream}
          name={myName}
          isSpeaking={activeSpeaker === socket.id}
          isMuted={false}
          isMe={true}
        />

        {/* Remote Videos */}
        {remoteParticipants.map(([id, user]: any) => (
          <VideoCard
            key={id}
            stream={remoteStreams[id]}
            name={user.name}
            isSpeaking={activeSpeaker === id}
            isMuted={!user.mic}
            isMe={false}
          />
        ))}
      </div>
    </div>
  );
}

