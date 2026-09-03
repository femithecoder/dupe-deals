"use client"

import { useEffect, useRef, useState } from "react"
import { matchFaq } from "@/lib/faqMatcher"

type Message = {
  id: string
  from: "bot" | "user"
  text: string
  escalate?: boolean
}

const GREETING: Message = {
  id: "greeting",
  from: "bot",
  text: "Hi, I'm Dede! Ask me about how the site works, deals, dupes, shipping, returns, or anything else. I'll put you in touch with a real person if I can't help.",
}

function nextId() {
  return Math.random().toString(36).slice(2)
}

function buildEscalationMailto(transcript: Message[]): string {
  const body = transcript
    .map((m) => `${m.from === "user" ? "You" : "Bot"}: ${m.text}`)
    .join("\n")
  const subject = "DupeDeals chat: need a hand"
  return `mailto:contactus@dupedeals.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, open])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMessage: Message = { id: nextId(), from: "user", text }
    const match = matchFaq(text)

    const botMessage: Message = match
      ? { id: nextId(), from: "bot", text: match.entry.answer }
      : {
          id: nextId(),
          from: "bot",
          text: "I'm not able to help with that one. Want me to pass it to a real person?",
          escalate: true,
        }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput("")
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between bg-gradient-to-br from-violet-500 to-purple-600 px-4 py-3 text-white">
            <span className="font-bold text-sm">Dede · DupeDeals Support</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.escalate && (
                    <a
                      href={buildEscalationMailto(messages)}
                      className="mt-2 inline-block rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition"
                    >
                      Talk to a human →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl shadow-lg hover:shadow-xl transition"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  )
}
