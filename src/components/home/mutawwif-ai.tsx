"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const QUICK_REPLIES = [
  "How to book luggage assistance?",
  "What Ziyarat tours are available?",
  "Airport transfer from Jeddah",
  "Hajj 2026 packages",
];

const BOT_RESPONSES: Record<string, string> = {
  "how to book luggage assistance?":
    "Assalamu Alaikum! 🧳 To book luggage assistance:\n\n1. Select **Luggage** from the search bar above\n2. Enter your pick-up & drop-off locations\n3. Choose your date\n4. Pick the number of suitcases\n5. Hit Search!\n\nOur verified partners will handle your bags with care. Prices start from $15.",
  "what ziyarat tours are available?":
    "We offer several Ziyarat tours in shaa Allah:\n\n🕌 **Makkah Ziyarat** — Cave of Hira, Jabal Rahmah, Muzdalifah\n🕌 **Madinah Ziyarat** — Quba Mosque, Uhud, Qiblatain\n🕌 **Full Day Tour** — Comprehensive city tours with licensed guides\n\nAll tours include AC transport and multilingual guides. Book from the search bar!",
  "airport transfer from jeddah":
    "For Jeddah airport transfers:\n\n✈️ **Private sedan** — up to 3 guests, from $45\n🚐 **VIP Minibus** — up to 7 guests, from $75\n🚌 **Coach** — up to 15 guests, from $120\n\nAll drivers are verified and will meet you at arrivals with a name board. In shaa Allah!",
  "hajj 2026 packages":
    "Hajj 2026 season is approaching! Here's what we help with:\n\n📋 We don't sell Hajj packages directly, but we provide **all ground services**:\n• Airport transfers\n• Luggage handling\n• Ziyarat tours\n• City taxis\n• SIM card recharge\n\nCheck with your Hajj operator for the package, and book our services for a smooth experience!",
};

export function MutawwifAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Assalamu Alaikum! 👋\n\nI'm **Mutawwif AI**, your virtual pilgrimage assistant. How can I help you plan your sacred journey today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const key = text.trim().toLowerCase();
      const response =
        BOT_RESPONSES[key] ||
        "Jazak Allah Khair for your question! 🤲\n\nI'm still learning, but here's what I can help with:\n• Luggage assistance bookings\n• Ziyarat tour information\n• Airport transfers\n• Hajj 2026 services\n\nTry asking about any of these topics, or visit our **Services** section above!";

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: response };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-zinc-200 overflow-hidden flex flex-col"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-[15px]">Mutawwif AI</p>
                  <p className="text-white/70 text-xs">Your pilgrimage assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-zinc-50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-amber-700" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[260px] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-amber-600 text-white rounded-br-md"
                        : "bg-white text-zinc-700 border border-zinc-100 shadow-sm rounded-bl-md"
                    )}
                  >
                    {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-white border-t border-zinc-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full whitespace-nowrap transition shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-zinc-100 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask Mutawwif AI..."
                className="flex-1 text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  input.trim() ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md" : "bg-zinc-100 text-zinc-400"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <div className="absolute inset-[-1.5px] rounded-full bg-gradient-to-r from-amber-200 via-yellow-500 to-[#8B4513]" />
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative z-10 flex items-center gap-2.5 rounded-full shadow-2xl transition-all duration-300",
            open
              ? "w-12 h-12 bg-zinc-900 justify-center"
              : "h-12 px-6 bg-[#1a1a1a]"
          )}
        >
          <div className={cn(
            "absolute inset-0 rounded-full transition-opacity duration-300",
            !open ? "bg-gradient-to-r from-[#8B4513] to-[#B8860B]" : "opacity-0"
          )} />
          <div className="relative z-10 flex items-center gap-2.5">
            {open ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-[13px] tracking-wide hidden sm:inline uppercase">Mutawwif AI</span>
              </>
            )}
          </div>
        </motion.button>
      </div>
    </>
  );
}
