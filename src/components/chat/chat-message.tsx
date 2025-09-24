"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const parts = (Array.isArray(message.parts) ? message.parts : []) as any[];

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
        {/* Render text parts from the UIMessage parts */}
        {parts
          .filter((p) => p?.type === "text")
          .map((p, i) => (
            <span key={i}>{p.text}</span>
          ))}
        </div>
        
        {/* Display image if present in parts with file data */}
        {parts
          .filter((p) => p?.type === "file")
          .flatMap((p) => p.files ?? [])
          .map((attachment: any, index: number) => (
          <div key={index} className="mt-2">
            {attachment.contentType?.startsWith("image/") && attachment.url && (
              <img
                src={attachment.url}
                alt="Uploaded image"
                className="rounded-lg max-w-full"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
