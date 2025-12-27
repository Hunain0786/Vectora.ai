"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Plus } from "lucide-react"
import { ChatMessages, Message } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"

export default function ChatPage() {

  const router = useRouter()
  const [conversations, setConversations] = useState([
    { id: "1", title: "New Conversation", date: "Just now" },
  ])
  const [activeConversation, setActiveConversation] = useState("1")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthPopup, setShowAuthPopup] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (!user) {
      setShowAuthPopup(true)
    }
  }, [])

  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(parsed)
      } catch (e) {
        console.error("Failed to parse messages", e)
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages))
    }
  }, [messages])


  // Restore CSV state on load
  useEffect(() => {
    const cachedCsv = localStorage.getItem("cached_csv")
    const cachedFilename = localStorage.getItem("cached_filename") || "restored_data.csv"

    if (cachedCsv) {
      // Create a file object
      const blob = new Blob([cachedCsv], { type: 'text/csv' });
      const file = new File([blob], cachedFilename, { type: 'text/csv' });

      const formData = new FormData();
      formData.append("file", file);

      // Re-upload silently in background to restore server state
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData
      }).then(() => {
        console.log("Session restored from localStorage")
      }).catch(err => {
        console.error("Failed to restore session", err)
      })
    }
  }, [])

  const handleSendMessage = async (content: string, visualize: boolean) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: content,
          visualize: visualize
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.charts) {
        localStorage.setItem("active_chart", JSON.stringify(data.charts))
      }

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        charts: data.charts
      }
      setMessages((prev) => [...prev, newBotMessage])

    } catch (error: any) {
      console.error("Error communicating with AI:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Sorry, I encountered an error connecting to the server.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="flex items-center justify-between px-2 py-2">
                <SidebarGroupLabel className="text-base font-semibold">Data Chat</SidebarGroupLabel>
                <Button size="icon" variant="ghost" className="size-7">
                  <Plus className="size-4" />
                </Button>
              </div>
              <Separator className="my-2" />
              <SidebarGroupContent>
                <SidebarMenu>
                  {conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        isActive={activeConversation === conversation.id}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <MessageSquare className="size-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{conversation.title}</span>
                          <span className="text-xs text-muted-foreground">{conversation.date}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex h-full flex-col">
            <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold">{conversations.find((c) => c.id === activeConversation)?.title}</h1>
            </header>

            <div className="flex flex-1 flex-col overflow-hidden">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </SidebarInset>

        {showAuthPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col space-y-4 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Sign in to continue
                </h2>
                <p className="text-sm text-muted-foreground">
                  To keep chatting with your data assistant, please sign in to your account.
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  )
}
