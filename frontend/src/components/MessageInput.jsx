import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const sendingRef = useRef(false); // hard guard against rapid clicks
  const fileInputRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();

  // Disable image upload when chatting with AI
  const disableImage =
    selectedUser?.isAI || selectedUser?._id === "ai-assistant";

  // Clear any selected image if we switch to AI chat
  useEffect(() => {
    if (disableImage && imagePreview) {
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [disableImage, imagePreview]);

  const handleImageChange = (e) => {
    if (disableImage) {
      toast("Image upload is disabled in AI chat");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed && !imagePreview) return;

    // Prevent double submit immediately
    if (sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);

    try {
      if (disableImage) {
        // Send text only in AI chat
        await sendMessage({ text: trimmed });
      } else {
        await sendMessage(
          imagePreview
            ? { text: trimmed, image: imagePreview }
            : { text: trimmed }
        );
      }

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      sendingRef.current = false;
    }
  };

  const onAttachClick = () => {
    if (disableImage) {
      toast("Image upload is disabled in AI chat");
      return;
    }

    if (isSending) return;

    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
              disabled={isSending}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder={
              selectedUser?.isAI ? "Ask Chatrix AI..." : "Type a message..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
          />

          {/* File input only when images are enabled */}
          {!disableImage && (
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isSending}
            />
          )}

          <button
            type="button"
            onClick={onAttachClick}
            className={`hidden sm:flex btn btn-circle ${
              disableImage || isSending
                ? "btn-disabled opacity-60 cursor-not-allowed"
                : imagePreview
                ? "text-emerald-500"
                : "text-zinc-400"
            }`}
            title={
              disableImage
                ? "Image upload is disabled in AI chat"
                : "Attach image"
            }
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
