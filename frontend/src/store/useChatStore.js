import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// --- message sound helper ---
let dingAudio = null;
let dingPrimed = false;

function pickSoundSrc() {
  if (typeof document !== "undefined") {
    const test = document.createElement("audio");
    if (test.canPlayType && test.canPlayType('audio/ogg; codecs="vorbis"')) {
      return "/sounds/notify.ogg";
    }
  }
  return "/sounds/notify.mp3";
}

function initDing() {
  if (typeof window === "undefined" || dingAudio) return;
  dingAudio = new Audio(pickSoundSrc());
  dingAudio.preload = "auto";
  dingAudio.volume = 0.85;

  const prime = async () => {
    if (!dingAudio || dingPrimed) return;
    try {
      await dingAudio.play();
      dingAudio.pause();
      dingAudio.currentTime = 0;
      dingPrimed = true;
    } catch {
      // Will succeed after a user gesture
    }
  };

  // Autoplay unlock after first click/tap
  window.addEventListener("pointerdown", prime, { once: true, passive: true });
}

function playDing() {
  if (!dingAudio) return;
  dingAudio.currentTime = 0;
  dingAudio.play().catch(() => {});
}
// --- end helper ---

// ========== AI constants/helpers ==========
const AI_ID = "ai-assistant";
const AI_USER = {
  _id: AI_ID,
  fullName: "Chatrix AI",
  isAI: true,
  profilePic: "/ai.jpg",
};

// Base key (we’ll suffix it with the signed-in userId)
const AI_STORAGE_KEY = "ai-assistant-messages";

const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

// Get the current signed-in user's ID from the auth store
const getCurrentUserId = () => {
  try {
    const auth = useAuthStore.getState();
    const me = auth?.authUser || auth?.user;
    return me?._id || "anon"; // fallback if called before login
  } catch {
    return "anon";
  }
};

const getAiStorageKey = () => `${AI_STORAGE_KEY}:${getCurrentUserId()}`;

const loadAiMessages = () => {
  try {
    const s = localStorage.getItem(getAiStorageKey());
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const saveAiMessages = (msgs) => {
  try {
    localStorage.setItem(getAiStorageKey(), JSON.stringify(msgs.slice(-100)));
  } catch {}
};
// =========================================

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Load users and append AI Assistant as a contact
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const list = Array.isArray(res.data) ? res.data : [];
      const hasAI = list.some((u) => u._id === AI_ID);
      set({ users: hasAI ? list : [AI_USER, ...list] });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to load users"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Load messages: from API for humans, from localStorage for AI
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      if (userId === AI_ID) {
        set({ messages: loadAiMessages() });
      } else {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to load messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    try {
      // ===== AI conversation =====
      if (selectedUser?.isAI || selectedUser?._id === AI_ID) {
        const auth = useAuthStore.getState();
        const me = auth.authUser || auth.user;
        const myId = me?._id || "me";

        const text =
          messageData?.text ??
          messageData?.content ??
          messageData?.message ??
          "";
        const trimmed = typeof text === "string" ? text.trim() : "";
        if (!trimmed) return;

        // 1) Add my message locally and persist
        const myMsg = {
          _id: genId(),
          senderId: myId,
          receiverId: AI_ID,
          text: trimmed,
          createdAt: new Date().toISOString(),
        };

        let updated;
        set((state) => {
          updated = [...state.messages, myMsg];
          return { messages: updated };
        });
        saveAiMessages(updated);

        // 2) Build history from previous messages only (exclude myMsg)
        const prev = updated.slice(0, -1);
        const history = prev.slice(-20).map((m) => ({
          role: m.senderId === myId ? "user" : "assistant",
          content: m.text || "",
        }));

        // 3) Call backend AI route
        let aiText = "";
        try {
          const res = await axiosInstance.post("/ai/chat", {
            message: trimmed,
            history,
          });
          aiText = res.data?.text || "Sorry, I couldn’t generate a reply.";
        } catch (err) {
          const status = err?.response?.status;

          // Special handling for rate limit
          if (status === 429) {
            const headers = err?.response?.headers || {};
            const serverMsg = err?.response?.data?.message;

            // Try to compute seconds until reset from RateLimit-Reset/Retry-After
            const resetRaw =
              headers["ratelimit-reset"] ||
              headers["x-ratelimit-reset"] ||
              headers["retry-after"];
            let seconds = 0;
            if (resetRaw) {
              const n = Number(resetRaw);
              if (Number.isFinite(n)) {
                const nowSec = Math.floor(Date.now() / 1000);
                seconds = n > nowSec ? n - nowSec : n;
              }
            }

            const msg =
              serverMsg ||
              (seconds
                ? `AI limit reached. Try again in ${seconds}s.`
                : "AI limit reached. Try again shortly.");
            toast.error(msg);

            // Important: do not append an AI error message
            return;
          }

          const msg = err?.response?.data?.message || "AI request failed";
          toast.error(msg);
          aiText = "I ran into an error. Please try again.";
        }

        // 4) Append AI reply and persist
        const aiMsg = {
          _id: genId(),
          senderId: AI_ID,
          receiverId: myId,
          text: aiText,
          createdAt: new Date().toISOString(),
        };

        const finalMsgs = [...updated, aiMsg];

        // Only update UI and play ding if user is still on AI chat
        const stillOnAI =
          get().selectedUser?.isAI || get().selectedUser?._id === AI_ID;

        if (stillOnAI) {
          set(() => ({ messages: finalMsgs }));
          initDing();
          playDing();
        }

        // Persist regardless so the reply appears when they return to AI chat
        saveAiMessages(finalMsgs);
        return;
      }

      // ===== Human-to-human message =====
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to send"
      );
    }
  },

  // Socket subscription for human chats only (skip AI chat)
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // Skip sockets for AI conversation
    if (selectedUser.isAI || selectedUser._id === AI_ID) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove any existing listener to avoid duplicates
    socket.off("newMessage");

    // Ensure audio is ready (sets up priming on first user interaction)
    initDing();

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set((state) => ({ messages: [...state.messages, newMessage] }));

      // Ring for this case only
      playDing();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
