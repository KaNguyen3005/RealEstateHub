import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
}

function getSenderId(message: ChatMessage) {
  return typeof message.senderId === "string" ? message.senderId : message.senderId._id;
}

function getSenderName(message: ChatMessage) {
  return typeof message.senderId === "string" ? "User" : message.senderId.fullName;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwnMessage = getSenderId(message) === currentUserId;

  return (
    <div className={isOwnMessage ? "flex justify-end" : "flex justify-start"}>
      <div className={isOwnMessage ? "max-w-[78%] rounded-lg bg-primary px-4 py-3 text-primary-foreground" : "max-w-[78%] rounded-lg bg-muted px-4 py-3 text-foreground"}>
        {!isOwnMessage ? <p className="mb-1 text-xs font-semibold text-muted-foreground">{getSenderName(message)}</p> : null}
        <p className="whitespace-pre-line text-sm leading-6">{message.content}</p>
        <p className={isOwnMessage ? "mt-2 text-right text-[11px] text-primary-foreground/70" : "mt-2 text-right text-[11px] text-muted-foreground"}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
