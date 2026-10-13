import { API_BASE_URL } from "@/lib/api";

export interface DirectMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  body: string;
  createdAt: string;
}

export interface DirectMessageParticipant {
  id: string;
  name: string;
  avatar: string;
  graduationYear?: number;
  occupation?: string;
}

export interface DirectMessageThread {
  id: string;
  participant1: DirectMessageParticipant;
  participant2: DirectMessageParticipant;
  subject: string;
  lastMessage: string;
  lastActivityAt: string;
  unreadCount: number;
  messages: DirectMessageItem[];
}

export const INITIAL_DIRECT_THREADS: DirectMessageThread[] = [];

const STORAGE_KEY = "m3s_direct_messages";

export function getStoredThreads(): DirectMessageThread[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Discard legacy static dummy threads
      return parsed.filter(
        (t: any) => t.id !== "dm-thread-1" && t.id !== "dm-thread-2"
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: DirectMessageThread[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new Event("m3s_messages_change"));
  } catch {
    // Graceful fallback
  }
}

export function getThreadById(threadId: string): DirectMessageThread | undefined {
  const threads = getStoredThreads();
  return threads.find((t) => t.id === threadId);
}

export function sendNewDirectMessage(
  recipient: DirectMessageParticipant,
  subject: string,
  body: string,
  currentUserOverride?: DirectMessageParticipant
): DirectMessageThread {
  const threads = getStoredThreads();

  // Determine current user
  let sender: DirectMessageParticipant = {
    id: "user-budi",
    name: "Budi Santoso, S.Kom.",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2018,
    occupation: "Senior Backend Engineer",
  };

  if (currentUserOverride) {
    sender = currentUserOverride;
  } else if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("m3s_user");
      if (stored) {
        const u = JSON.parse(stored);
        sender = {
          id: u.id || "user-current",
          name: u.name || "Alumnus M3S",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2018,
          occupation: "Alumni MAN 3 Sleman",
        };
      }
    } catch {
      // Fallback to default sender
    }
  }

  // Check if a thread with this recipient already exists
  const existingIndex = threads.findIndex(
    (t) =>
      (t.participant1.id === recipient.id || t.participant2.id === recipient.id) &&
      (t.participant1.id === sender.id || t.participant2.id === sender.id)
  );

  const newMessage: DirectMessageItem = {
    id: `msg-${Date.now()}`,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    const thread = threads[existingIndex];
    thread.messages.push(newMessage);
    thread.lastMessage = body.trim();
    thread.lastActivityAt = newMessage.createdAt;
    thread.unreadCount = 0; // We just sent it
    threads.splice(existingIndex, 1);
    threads.unshift(thread);
    saveThreads(threads);
    return thread;
  }

  // Create new thread
  const newThread: DirectMessageThread = {
    id: `dm-thread-${Date.now()}`,
    participant1: sender,
    participant2: recipient,
    subject: subject.trim() || "Pesan Pribadi Alumni",
    lastMessage: body.trim(),
    lastActivityAt: newMessage.createdAt,
    unreadCount: 0,
    messages: [newMessage],
  };

  threads.unshift(newThread);
  saveThreads(threads);

  // Synchronize with Laravel backend API
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("m3s_token");
    if (token && recipient.id) {
      fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient_id: recipient.id,
          subject: subject.trim() || "Pesan Alumni",
          content: body.trim(),
        }),
      }).catch(() => {
        // Fallback handled locally
      });
    }
  }

  return newThread;
}

export function replyDirectMessage(
  threadId: string,
  body: string,
  currentUserOverride?: DirectMessageParticipant
): DirectMessageItem | null {
  const threads = getStoredThreads();
  const threadIndex = threads.findIndex((t) => t.id === threadId);
  if (threadIndex < 0) return null;

  let sender: DirectMessageParticipant = {
    id: "user-budi",
    name: "Budi Santoso, S.Kom.",
    avatar: "/images/avatar-ahmad.jpg",
    graduationYear: 2018,
  };

  if (currentUserOverride) {
    sender = currentUserOverride;
  } else if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("m3s_user");
      if (stored) {
        const u = JSON.parse(stored);
        sender = {
          id: u.id || "user-current",
          name: u.name || "Alumnus M3S",
          avatar: "/images/avatar-ahmad.jpg",
          graduationYear: 2018,
        };
      }
    } catch {
      // Fallback
    }
  }

  const thread = threads[threadIndex];
  const newMessage: DirectMessageItem = {
    id: `msg-${Date.now()}`,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };

  thread.messages.push(newMessage);
  thread.lastMessage = body.trim();
  thread.lastActivityAt = newMessage.createdAt;
  thread.unreadCount = 0;

  // Move thread to top
  threads.splice(threadIndex, 1);
  threads.unshift(thread);
  saveThreads(threads);

  // Synchronize reply with Laravel backend API
  if (typeof window !== "undefined") {
    const isUuid = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const token = localStorage.getItem("m3s_token");
    if (token && isUuid(threadId)) {
      fetch(`${API_BASE_URL}/messages/threads/${threadId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: body.trim(),
        }),
      }).catch(() => {
        // Fallback handled locally
      });
    }
  }

  return newMessage;
}

export function markThreadAsRead(threadId: string): void {
  const threads = getStoredThreads();
  const thread = threads.find((t) => t.id === threadId);
  if (thread && thread.unreadCount > 0) {
    thread.unreadCount = 0;
    saveThreads(threads);
  }

  if (typeof window !== "undefined") {
    const isUuid = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const token = localStorage.getItem("m3s_token");
    if (token && isUuid(threadId)) {
      fetch(`${API_BASE_URL}/messages/threads/${threadId}/read`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        // Fallback handled
      });
    }
  }
}

export function getTotalUnreadCount(): number {
  const threads = getStoredThreads();
  return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
}

export async function syncThreadsWithBackend(): Promise<void> {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("m3s_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/messages/threads`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return;
    const json = await res.json();
    if (Array.isArray(json?.data) && json.data.length > 0) {
      const userStr = localStorage.getItem("m3s_user");
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const currentParticipant: DirectMessageParticipant = {
        id: currentUser?.id || "user-current",
        name: currentUser?.name || "Saya",
        avatar: currentUser?.avatar || "/images/avatar-ahmad.jpg",
      };

      const backendThreads: DirectMessageThread[] = json.data.map((item: any) => ({
        id: item.id,
        participant1: currentParticipant,
        participant2: {
          id: item.participant?.id || "user-partner",
          name: item.participant?.name || "Alumni M3S",
          avatar: item.participant?.avatar || "/images/avatar-siti.jpg",
          graduationYear: item.participant?.graduation_year,
          occupation: item.participant?.occupation ? `${item.participant.occupation} at ${item.participant.company || ""}` : undefined,
        },
        subject: item.subject || "Pesan Alumni",
        lastMessage: item.last_message || "",
        lastActivityAt: item.last_message_at || new Date().toISOString(),
        unreadCount: item.unread_count || 0,
        messages: [],
      }));

      // Merge backend threads with existing local threads (avoiding duplicates)
      const existing = getStoredThreads();
      const existingIds = new Set(backendThreads.map((bt) => bt.id));
      const combined = [...backendThreads, ...existing.filter((et) => !existingIds.has(et.id))];
      saveThreads(combined);
    }
  } catch {
    // Ignore network error in fallback mode
  }
}
