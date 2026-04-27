import { useMeetingStore } from "@/store/useMeetingStore";
import { socket } from "@/lib/socket";
import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, X } from "lucide-react";

export default function ChatPanel() {
  const { messages, setChatOpen } = useMeetingStore();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      roomId: "room", // TODO: dynamic roomId
      message: text,
      senderId: "me",
    });

    setText("");
  };

  return (
    <div className="w-80 bg-[#1A1B23] border-l border-gray-800 flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <MessageSquare size={18} className="text-purple-400" />
          <span>In-call Messages</span>
        </div>
        <button 
          onClick={() => setChatOpen(false)}
          className="text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>


      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <p className="text-xs max-w-[150px]">
              Messages can only be seen by people in the call.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.senderId === "me" ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-gray-500 mb-1 px-1">
              {m.senderId === "me" ? "You" : `User ${m.senderId.slice(0, 4)}`}
            </span>
            <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-sm ${
              m.senderId === "me" 
                ? "bg-purple-600 text-white rounded-tr-none" 
                : "bg-gray-800 text-gray-200 rounded-tl-none"
            }`}>
              {m.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 bg-[#0F0F14] p-1 rounded-xl border border-gray-800 focus-within:border-purple-500 transition shadow-inner">
          <input
            className="flex-1 bg-transparent p-2 text-sm text-white outline-none"
            placeholder="Send a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!text.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}