"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Send, Paperclip } from "lucide-react"

export function ChatInput({ onSendMessage, isLoading }: { onSendMessage: (msg: string, visualize: boolean) => void, isLoading: boolean }) {
  const [message, setMessage] = useState("")
  const [visualize, setVisualize] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    onSendMessage(message, visualize)
    setMessage("")
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about your data..."
              className="min-h-[60px] resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="button" size="icon" variant="ghost" className="absolute bottom-2 right-2 size-8">
              <Paperclip className="size-4" />
            </Button>
          </div>
          <Button type="submit" size="icon" disabled={!message.trim() || isLoading} className="size-[60px]">
            <Send className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="visualize" checked={visualize} onCheckedChange={(checked) => setVisualize(checked as boolean)} />
            <Label htmlFor="visualize" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Visualize
            </Label>
          </div>
          <p className="ml-auto text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </form>
    </div>
  )
}
