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

export const INITIAL_DIRECT_THREADS: DirectMessageThread[] = [
  {
    id: "dm-thread-1",
    participant1: {
      id: "user-budi",
      name: "Budi Santoso, S.Kom.",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2018,
      occupation: "Senior Backend Engineer",
    },
    participant2: {
      id: "alumni-1",
      name: "Siti Nurhaliza, S.T.",
      avatar: "/images/avatar-siti.jpg",
      graduationYear: 2012,
      occupation: "Software Engineer di Tokopedia",
    },
    subject: "Tanya Peluang Karir Frontend di Tokopedia",
    lastMessage: "Wa'alaikumsalam Mas Budi. Kuota Q4 sedang buka untuk junior web engineer. Silakan kirimkan CV rekannya, nanti saya bantu proses referral alumni.",
    lastActivityAt: "2026-10-06T14:20:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "msg-101",
        senderId: "user-budi",
        senderName: "Budi Santoso, S.Kom.",
        senderAvatar: "/images/avatar-ahmad.jpg",
        body: "Assalamu'alaikum Mbak Siti, salam kenal sesama alumni Mayoga. Kebetulan ada rekan seangkatan kami yang berminat melamar di tim web Tokopedia. Apakah saat ini sedang ada posisi open role yang relevan?",
        createdAt: "2026-10-06T11:15:00Z",
      },
      {
        id: "msg-102",
        senderId: "alumni-1",
        senderName: "Siti Nurhaliza, S.T.",
        senderAvatar: "/images/avatar-siti.jpg",
        body: "Wa'alaikumsalam Mas Budi. Kuota Q4 sedang buka untuk junior web engineer. Silakan kirimkan CV rekannya, nanti saya bantu proses referral alumni.",
        createdAt: "2026-10-06T14:20:00Z",
      },
    ],
  },
  {
    id: "dm-thread-2",
    participant1: {
      id: "user-budi",
      name: "Budi Santoso, S.Kom.",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2018,
      occupation: "Senior Backend Engineer",
    },
    participant2: {
      id: "alumni-2",
      name: "Ahmad Fauzi, M.Pd.",
      avatar: "/images/avatar-ahmad.jpg",
      graduationYear: 2010,
      occupation: "Dosen & Peneliti UIN",
    },
    subject: "Koordinasi Sesi Bedah Beasiswa LPDP Reuni 2026",
    lastMessage: "Siap Mas Budi, nanti materi presentasi dan panduan esai beasiswa akan saya persiapkan bersama alumni awardee lainnya.",
    lastActivityAt: "2026-10-05T16:45:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg-201",
        senderId: "alumni-2",
        senderName: "Ahmad Fauzi, M.Pd.",
        senderAvatar: "/images/avatar-ahmad.jpg",
        body: "Assalamu'alaikum Mas Budi. Terkait agenda Reuni Akbar 2026, apakah panitia berkenan menyediakan sesi workshop bedah esai beasiswa pascasarjana untuk adik-adik alumni baru?",
        createdAt: "2026-10-05T09:30:00Z",
      },
      {
        id: "msg-202",
        senderId: "user-budi",
        senderName: "Budi Santoso, S.Kom.",
        senderAvatar: "/images/avatar-ahmad.jpg",
        body: "Wa'alaikumsalam Pak Dosen Ahmad. Usulan yang sangat strategis! Kami sudah alokasikan sesi sarasehan pendidikan di aula utama. Mohon kesediaan Bapak untuk menjadi pemateri utama.",
        createdAt: "2026-10-05T13:00:00Z",
      },
      {
        id: "msg-203",
        senderId: "alumni-2",
        senderName: "Ahmad Fauzi, M.Pd.",
        senderAvatar: "/images/avatar-ahmad.jpg",
        body: "Siap Mas Budi, nanti materi presentasi dan panduan esai beasiswa akan saya persiapkan bersama alumni awardee lainnya.",
        createdAt: "2026-10-05T16:45:00Z",
      },
    ],
  },
];

const STORAGE_KEY = "m3s_direct_messages";

export function getStoredThreads(): DirectMessageThread[] {
  if (typeof window === "undefined") {
    return INITIAL_DIRECT_THREADS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DIRECT_THREADS));
      return INITIAL_DIRECT_THREADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DIRECT_THREADS;
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

  return newMessage;
}

export function markThreadAsRead(threadId: string): void {
  const threads = getStoredThreads();
  const thread = threads.find((t) => t.id === threadId);
  if (thread && thread.unreadCount > 0) {
    thread.unreadCount = 0;
    saveThreads(threads);
  }
}

export function getTotalUnreadCount(): number {
  const threads = getStoredThreads();
  return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
}
