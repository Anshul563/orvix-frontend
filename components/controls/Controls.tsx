import { socket } from "@/lib/socket";
import { useState } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { mediasoupManager } from "@/lib/mediasoup";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff,
  MoreVertical,
  MessageSquare,
  Share2,
  Check,
  Users
} from "lucide-react";

export default function Controls() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { 
    isChatOpen, 
    setChatOpen, 
    isParticipantsOpen, 
    setParticipantsOpen, 
    setLocalStream,
    users
  } = useMeetingStore();

  const participantCount = Object.keys(users).length + 1; // +1 for self


  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const toggleMic = () => {
    socket.emit("toggle-mic", { enabled: !mic });
    setMic(!mic);
  };

  const toggleCam = async () => {
    const nextState = !cam;
    setCam(nextState);

    if (nextState) {
      try {
        // Try getting both, but fall back if one is missing
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (e) {
          console.warn("Could not get both video and audio, trying video only...");
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        
        setLocalStream(stream);
        
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          await mediasoupManager.produce(videoTrack, "camera");
        }
      } catch (error: any) {
        console.error("Camera access error:", error);
        if (error.name === "NotFoundError") {
          alert("No camera or microphone found on this device.");
        }
        setCam(false);
      }
    } else {
      const { localStream } = useMeetingStore.getState();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      await mediasoupManager.stopProducing("camera");
    }

    socket.emit("toggle-camera", { enabled: nextState });
  };

  const toggleScreenShare = async () => {
    if (!isSharing) {
      try {
        const stream = await mediasoupManager.shareScreen();
        // optionally set this to a separate store field if you want to see your own screen share
        setIsSharing(true);
        stream.getVideoTracks()[0].onended = () => setIsSharing(false);
      } catch (err) {
        console.error("Screen share failed:", err);
      }
    } else {
      await mediasoupManager.stopProducing("screen");
      setIsSharing(false);
    }
  };




  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#1A1B23]/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-800 shadow-2xl group">
      <button 

        onClick={toggleMic}
        className={`p-3 rounded-xl transition-all ${
          mic ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50"
        }`}
      >
        {mic ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button 
        onClick={toggleCam}
        className={`p-3 rounded-xl transition-all ${
          cam ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50"
        }`}
      >
        {cam ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      <button 
        onClick={toggleScreenShare}
        className={`p-3 rounded-xl transition-all ${
          isSharing ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
      >
        <Monitor size={20} />
      </button>


      <div className="w-px h-8 bg-gray-800 mx-2" />

      <button className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/20">
        <PhoneOff size={20} />
      </button>

      <button 
        onClick={() => setChatOpen(!isChatOpen)}
        className={`p-3 rounded-xl transition-all ${
          isChatOpen ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
      >
        <MessageSquare size={20} />
      </button>

      <button 
        onClick={() => setParticipantsOpen(!isParticipantsOpen)}
        className={`relative p-3 rounded-xl transition-all ${
          isParticipantsOpen ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
      >
        <Users size={20} />
        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#1A1B23]">
          {participantCount}
        </span>
      </button>

      <button 
        onClick={copyLink}

        className="relative p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all group/share"
      >
        {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
        {copied && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded shadow-lg font-bold">
            Copied!
          </div>
        )}
      </button>

      <button className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all">
        <MoreVertical size={20} />
      </button>


      {/* Reactions Menu (Floating above) */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-2 bg-[#1A1B23]/90 backdrop-blur-md p-2 rounded-xl border border-gray-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
        {["❤️", "👍", "👏", "🚀"].map((emoji) => (
          <button
            key={emoji}
            onClick={() => socket.emit("send-reaction", { emoji })}
            className="hover:scale-125 transition text-lg p-1"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}


