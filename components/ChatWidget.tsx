"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "agent" | "user";
  text: string;
}

interface LeadData {
  name: string;
  budget: string;
  neighborhoods: string;
  bedrooms: string;
  timeline: string;
  preApproved: string;
}

const QUESTIONS = [
  "May I start with your full name?",
  "Great! And what's your approximate budget range? (e.g., $400k–$600k)",
  "Which neighborhoods or areas are you most interested in?",
  "How many bedrooms are you looking for?",
  "What's your ideal move-in timeline? (e.g., within 3 months, 6 months, flexible)",
  "Are you currently pre-approved for a mortgage? (Yes / No)",
];

const FIELD_KEYS: (keyof LeadData)[] = [
  "name",
  "budget",
  "neighborhoods",
  "bedrooms",
  "timeline",
  "preApproved",
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState<Partial<LeadData>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        role: "agent",
        text: `Hi! Welcome to Prestige Properties 👋 I'm here to help match you with your perfect home. ${QUESTIONS[0]}`,
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitLead = async (finalLead: LeadData) => {
    setSending(true);
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead),
      });
    } catch (err) {
      console.error("Failed to submit lead:", err);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || done) return;

    // Add user message
    const userMessage: Message = { role: "user", text: trimmed };
    const newMessages = [...messages, userMessage];

    // Store answer
    const fieldKey = FIELD_KEYS[step];
    const updatedLead = { ...lead, [fieldKey]: trimmed };
    setLead(updatedLead);

    const nextStep = step + 1;

    if (nextStep < QUESTIONS.length) {
      // Next question
      const agentMessage: Message = {
        role: "agent",
        text: QUESTIONS[nextStep],
      };
      setMessages([...newMessages, agentMessage]);
      setStep(nextStep);
    } else {
      // All done
      const name = (updatedLead.name ?? "").split(" ")[0] || "there";
      const closingMessage: Message = {
        role: "agent",
        text: `Thank you ${name}! I've got everything I need. One of our agents will be in touch with you shortly. 🏡`,
      };
      setMessages([...newMessages, closingMessage]);
      setDone(true);
      submitLead(updatedLead as LeadData);
    }

    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ backgroundColor: "#1e3a5f" }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
          PP
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Prestige Properties</p>
          <p className="text-blue-200 text-xs">AI Intake Agent · Online now</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 min-h-[320px] max-h-[420px] bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "agent" && (
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 mr-2 mt-1 shrink-0">
                P
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "agent"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                  : "text-white rounded-tr-sm"
              }`}
              style={
                msg.role === "user"
                  ? { backgroundColor: "#1e3a5f" }
                  : undefined
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 mr-2 mt-1 shrink-0">
              P
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={done}
          placeholder={done ? "Intake complete — we'll be in touch!" : "Type your answer..."}
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={done || !input.trim()}
          className="px-4 py-2.5 rounded-full text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#1e3a5f" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
