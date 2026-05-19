import { useState, useRef, useEffect, memo, useCallback } from "react";
import SYSTEM_PROMPT from "../data/chatbotData";
import { BotMessageSquareIcon } from "./BotMessageSquareIcon";
import { ArrowRight, X } from "lucide-react";

const AIChatbot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    const userMessage = { role: "user", content: userMessageContent };
    
    // Update messages immediately with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
    
      setMessages((currentMessages) => {

        const historyMessages = currentMessages.slice(1).map((msg) => ({
          role: msg.role === "model" ? "assistant" : "user",
          content: msg.content,
        }));

        // Make the API call with the history
        const makeRequest = async () => {
          try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...historyMessages,
                  { role: "user", content: userMessageContent },
                ],
              }),
            });

            const data = await response.json();
            const reply =
              data.choices?.[0]?.message?.content ??
              "Sorry, I couldn't respond. Try again!";

            setMessages((prev) => [...prev, { role: "model", content: reply }]);
          } catch (error) {
            console.error("API Error:", error);
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
        };

        makeRequest();
        return [...currentMessages, userMessage]; 
      });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  }, [input, isLoading]);


  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessageFixed = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    const userMessage = { role: "user", content: userMessageContent };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
   
      const currentMessages = messagesRef.current;
      

      const historyMessages = currentMessages.slice(1).map((msg) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.content,
      }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...historyMessages,
            { role: "user", content: userMessageContent },
          ],
        }),
      });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ??
        "Sorry, I couldn't respond. Try again!";

      setMessages((prev) => [...prev, { role: "model", content: reply }]);
    } catch (error) {
      console.error("API Error:", error);
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
  }, [input, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageFixed();
    }
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed bottom-36 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200
            transition-all duration-300 ease-out origin-bottom-right
            ${isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
            }`}
        >
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Ask about Joie</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-messageIn`}
                style={{ animationDelay: `${i * 0.05}s` }}
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
              <div className="flex justify-start animate-messageIn">
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
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center animate-slideUp">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Joie..."
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 outline-none focus:border-black transition-all duration-200 hover:border-gray-400 focus:scale-[1.02]"
            />
            <button
              onClick={sendMessageFixed}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-21 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl"
        aria-label="Toggle AI Chat"
      >
        <div className="relative w-6 h-6">
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              isOpen
                ? "opacity-0 scale-50 rotate-180"
                : "opacity-100 scale-100 rotate-0"
            }`}
          >
            <BotMessageSquareIcon size={24} />
          </div>
          
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              isOpen
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-50 -rotate-180"
            }`}
          >
            <X size={24} />
          </div>
        </div>
      </button>
    </>
  );
});

AIChatbot.displayName = "AIChatbot";
export default AIChatbot;