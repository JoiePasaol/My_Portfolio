import { useState, useRef, useEffect, memo, useCallback } from "react";

import SYSTEM_PROMPT from "../data/chatbotData";

const AIChatbot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Hi! I'm Joie's AI assistant 👋 Ask me anything about his skills, projects, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .slice(1)
        .map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));

   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // free
                messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history.map((msg) => ({
                    role: msg.role === "model" ? "assistant" : "user",
                    content: msg.content,
                })),
                { role: "user", content: userMessage.content },
                ],
            }),
            });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ??
        "Sorry, I couldn't respond. Try again!";

      setMessages((prev) => [...prev, { role: "model", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Ask about Joie</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Joie..."
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 outline-none focus:border-black transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity hover:opacity-80"
            >
              <i className="bx bx-send text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-21 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow-lg cursor-pointer transition-all hover:scale-105 drop-shadow-2xl"
        aria-label="Toggle AI Chat"
      >
        <i className={`bx ${isOpen ? "bx-x" : "bx-bot"} text-xl`} />
      </button>
    </>
  );
});

AIChatbot.displayName = "AIChatbot";
export default AIChatbot;