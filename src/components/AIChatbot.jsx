import { useState, useRef, useEffect, memo, useCallback } from "react";
import SYSTEM_PROMPT from "../data/chatbotData";
import { ArrowRight, X } from "lucide-react";
import { BotMessageSquareIcon } from "./BotMessageSquareIcon";

const ASSISTANT_NAME = "Ains";
const WELCOME_MESSAGE =
  "Hi! I'm Ains, Joie's AI assistant. Ask me about his projects, skills, experience, or how to get in touch.";

const SUGGESTIONS = [
  "What projects has Joie built?",
  "What's his tech stack?",
  "How can I contact him?",
];

const HIDE_DELAY_MS = 2000;

const renderInlineBold = (line) => {
  const segments = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return segments.map((seg, idx) =>
    seg.startsWith("**") && seg.endsWith("**") ? (
      <strong key={idx}>{seg.slice(2, -2)}</strong>
    ) : (
      <span key={idx}>{seg}</span>
    )
  );
};

const renderModelContent = (text) => {
  const withBreaks = text.replace(/\s*(?<!^)(\d+\.\s|-\s)/g, "\n$1");
  const lines = withBreaks
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, i) => (
    <p key={i} className={i < lines.length - 1 ? "mb-1.5" : ""}>
      {renderInlineBold(line)}
    </p>
  ));
};

const AIChatbot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesRef = useRef(messages);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showGreeting]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowSuggestions(false);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const touch = typeof window !== "undefined" && "ontouchstart" in window;
    setIsTouchDevice(!!touch);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleSuggestionsMouseEnter = () => {
    if (isTouchDevice || isOpen) return;
    clearHideTimeout();
    setShowSuggestions(true);
  };

  const handleSuggestionsMouseLeave = () => {
    if (isTouchDevice) return;
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, HIDE_DELAY_MS);
  };

  const sendTextMessage = useCallback(
    async (contentParam) => {
      const content = (contentParam ?? input).trim();
      if (!content || isLoading) return;

      const userMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const historyMessages = messagesRef.current.map((msg) => ({
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
              { role: "user", content: content },
            ],
          }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond. Try again!";

        setMessages((prev) => [...prev, { role: "model", content: reply }]);
      } catch (error) {
        console.error("API Error:", error);
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "Oops! Something went wrong. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };


  const handleStartConversation = () => {
    setShowGreeting(true);
    setHasStarted(true);
    setIsOpen(true);
  };

  const handleSuggestionClick = async (text) => {
    clearHideTimeout();
    setShowSuggestions(false);
    if (!isOpen) setIsOpen(true);
    setHasStarted(true);
    await sendTextMessage(text);
  };


  useEffect(() => {
    if (!showGreeting) return;
    let idx = 0;
    setTypedText("");
    setTypingDone(false);
    const interval = setInterval(() => {
      idx += 1;
      setTypedText(WELCOME_MESSAGE.slice(0, idx));
      if (idx >= WELCOME_MESSAGE.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [showGreeting]);

  const toggleFloat = () => {
    if (!isOpen && isTouchDevice) {
    
      setShowSuggestions((s) => !s);
      return;
    }
    setIsOpen((s) => !s);
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed sm:bottom-35 bottom-36 sm:right-5 right-4 z-50 w-11/12 max-w-[420px] sm:w-96 sm:h-[600px] h-[640px] bg-white dark:bg-black rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-out origin-bottom-right ${
            isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        >
          {!hasStarted ? (
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <img
                src="/assets/AI.png"
                alt={ASSISTANT_NAME}
                className="absolute inset-0 w-full h-full object-cover"
              />


              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50" />

              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full shadow-sm inline-block" />
                  <span className="text-xs tracking-widest text-white font-medium drop-shadow">ONLINE</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* bottom content: name, greeting, CTA */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-16 flex flex-col items-start gap-2">
                <h3 className="text-white text-2xl font-bold drop-shadow">{ASSISTANT_NAME}</h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-xs">
                  {WELCOME_MESSAGE}
                </p>
                <button
                  onClick={handleStartConversation}
                  className="mt-2 px-8 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header (chat mode only) */}
              <div className="bg-white dark:bg-black text-black dark:text-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img src="/assets/AI.png" alt="AI" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
                  <div>
                    <div className="text-sm font-semibold">{ASSISTANT_NAME}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</div>
                  </div>
                </div>

                <div className="ml-auto">
                  <button
                    onClick={() => { setIsOpen(false); setHasStarted(false); }}
                    className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-black text-black dark:text-white">
                <div>
                  {showGreeting && (
                    <div className="flex justify-start mb-2">
                      <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed bg-gray-100 text-black border border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800">
                        {!typingDone ? (
                          <span className="inline-block">
                            {typedText}
                            <span className="inline-block animate-[blink_1s_steps(1)_infinite] text-gray-800 dark:text-gray-300">▍</span>
                          </span>
                        ) : (
                          WELCOME_MESSAGE
                        )}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-gray-100 text-black border border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800"
                        }`}
                      >
                        {msg.role === "model" ? renderModelContent(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-2">
                      <div className="bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:border-gray-800 px-3 py-2 rounded-2xl">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.12}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-3 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-all duration-200"
                />
                <button
                  onClick={() => sendTextMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

     
      <div className="fixed bottom-15 sm:bottom-21 right-2 sm:right-6 z-50">
        <div
          className="relative"
          onMouseEnter={handleSuggestionsMouseEnter}
          onMouseLeave={handleSuggestionsMouseLeave}
        >
          <button
            onClick={toggleFloat}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl"
            aria-label="Toggle AI Chat"
          >
            <div className="relative w-6 h-6">
              <div
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? "opacity-0 scale-50 rotate-180" : "opacity-100 scale-100 rotate-0"
                }`}
              >
                <BotMessageSquareIcon size={24} />
              </div>
              <div
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-180"
                }`}
              >
                <X size={24} />
              </div>
            </div>
          </button>

          {!isOpen && showSuggestions && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 flex flex-col items-end gap-1.5 pointer-events-auto">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="bg-white dark:bg-gray-900 text-black dark:text-white py-1.5 px-3 rounded-full shadow-lg border border-black/10 dark:border-white/10 text-xs whitespace-nowrap cursor-pointer transition-transform duration-200 hover:scale-105 animate-slideUp"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

AIChatbot.displayName = "AIChatbot";
export default AIChatbot;