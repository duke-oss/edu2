"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender_type: "user" | "admin";
  content: string;
  created_at: string;
  read_at: string | null;
}

export default function ChatWidget() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 플레이어·어드민 페이지에서 숨김
  const hidden =
    /^\/courses\/.+\/player/.test(pathname) ||
    pathname.startsWith("/admin");

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // silent
    }
  }, []);

  // 열릴 때 메시지 로드 + 5초 polling
  useEffect(() => {
    if (!isOpen) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    loadMessages();
    intervalRef.current = setInterval(loadMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, loadMessages]);

  // 미읽음 배지: 닫혀 있을 때도 주기적으로 갱신
  useEffect(() => {
    if (!session?.user || hidden) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        // silent
      }
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 15000);
    return () => clearInterval(id);
  }, [session?.user, hidden]);

  // 메시지 목록 스크롤 자동 하단
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const content = input.trim();
    setSendError(null);
    setInput("");
    setSending(true);

    // 낙관적 UI
    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      sender_type: "user",
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
      } else {
        let errorText = "메시지 전송에 실패했습니다.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string" && data.error.trim()) {
            errorText = data.error;
          }
        } catch {
          // ignore parsing failure
        }
        // 롤백
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setInput(content);
        setSendError(errorText);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(content);
      setSendError("네트워크 오류로 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  if (hidden || status === "loading" || !session?.user) return null;

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="채팅 문의"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px] rounded-2xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between shrink-0">
            <div>
              <p className="font-semibold text-sm">1:1 문의 채팅</p>
              <p className="text-xs opacity-75">평균 응답시간: 1영업일 이내</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="opacity-75 hover:opacity-100 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-sm text-muted-foreground gap-2">
                <MessageCircle size={32} className="opacity-30" />
                <p>문의 사항을 입력하시면<br />관리자가 답변해드립니다.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words ${
                      msg.sender_type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.sender_type === "admin" && (
                      <p className="text-[10px] font-semibold opacity-60 mb-0.5">관리자</p>
                    )}
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender_type === "user" ? "opacity-60 text-right" : "opacity-50"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력 폼 */}
          {sendError && (
            <div className="px-3 pt-2 text-xs text-red-500">{sendError}</div>
          )}
          <form
            onSubmit={handleSend}
            className="shrink-0 flex items-center gap-2 px-3 py-3 border-t border-border"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/30 transition"
              disabled={sending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || sending}
              className="rounded-full shrink-0 w-9 h-9"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
