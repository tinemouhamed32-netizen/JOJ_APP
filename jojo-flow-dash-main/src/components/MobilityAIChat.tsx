import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageSquare, X } from "lucide-react";
import { mobilityRespond, type AIMessage } from "@/lib/mobility-ai";
import type { Vehicle } from "@/lib/transport-data";

const SUGGESTIONS = [
  "Analyse les retards",
  "Optimise la flotte",
  "Statut VIP",
  "Trafic A1",
];

export function MobilityAIChat({ fleet }: { fleet: Vehicle[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "ai",
      content:
        "👋 Bonjour, je suis JOJ Mobility AI. Je supervise la flotte en temps réel. Demande-moi une analyse, une optimisation ou un statut.",
      ts: Date.now(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const content = text.trim();
    if (!content) return;
    const userMsg: AIMessage = { role: "user", content, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = mobilityRespond(content, fleet);
      setMessages((m) => [...m, { role: "ai", content: reply, ts: Date.now() }]);
      setTyping(false);
    }, 550 + Math.random() * 400);
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 size-14 rounded-2xl flex items-center justify-center text-background shadow-[0_10px_40px_-10px_var(--primary)]"
        style={{ background: "var(--gradient-hero)" }}
        aria-label="Ouvrir JOJ Mobility AI"
      >
        {open ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed bottom-24 right-6 z-40 w-[min(420px,calc(100vw-2rem))] h-[min(580px,calc(100vh-8rem))] glass rounded-2xl flex flex-col overflow-hidden border border-primary/30"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div
                className="size-10 rounded-xl flex items-center justify-center text-background"
                style={{ background: "var(--gradient-hero)" }}
              >
                <MessageSquare className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">JOJ Mobility AI</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Connecté · supervision temps réel
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary/70 text-foreground rounded-bl-md border border-border"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-secondary/70 border border-border rounded-2xl px-3.5 py-2.5 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="px-3 pt-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 border border-border hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 flex items-center gap-2 border-t border-border mt-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose une question à l'IA…"
                className="flex-1 bg-input/60 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                className="size-10 rounded-xl flex items-center justify-center text-background"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
