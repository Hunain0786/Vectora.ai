"use client"

import { Card } from "@/components/ui/card"
import { User, Bot } from "lucide-react"
import { ChartRenderer } from "./chart-renderer"
import ReactMarkdown from "react-markdown"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  charts?: any
}


interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

import { Loader2 } from "lucide-react"

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="size-4 text-primary" />
              </div>
            )}

            <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <Card
                className={`p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                  }`}
              >
                <div className="text-sm leading-relaxed prose dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </Card>
              <span className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {message.role === "user" && (
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary">
                <User className="size-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-4 text-primary" />
            </div>
            <div className="flex items-center">
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
