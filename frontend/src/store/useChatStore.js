import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// --- message sound helper ---
let dingAudio = null;
let dingPrimed = false;

function pickSoundSrc() {
  if (typeof document !== 'undefined') {
    const test = document.createElement('audio');
    if (test.canPlayType && test.canPlayType('audio/ogg; codecs="vorbis"')) {
      return '/sounds/notify.ogg';
    }
  }
  return '/sounds/notify.mp3';
}

function initDing() {
  if (typeof window === 'undefined' || dingAudio) return;
  dingAudio = new Audio(pickSoundSrc());
  dingAudio.preload = 'auto';
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
  window.addEventListener('pointerdown', prime, { once: true, passive: true });
}

function playDing() {
  if (!dingAudio) return;
  dingAudio.currentTime = 0;
  dingAudio.play().catch(() => {});
}
// --- end helper ---

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // Ensure audio is ready (sets up priming on first user interaction)
    initDing();

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });

      // Ring for this case only
      playDing();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));