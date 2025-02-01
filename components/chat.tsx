"use client"

import { useEffect, useRef, useState } from "react"
import { useChat, type Message } from "ai/react"
import { Loader2, MessageSquare } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ChatLine } from "./chat-line"
import { scrollToBottom, initialMessages } from "@/lib/utils"

export function Chat() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, data } = useChat({
    initialMessages,
  })

  const handleReset = () => {
    setMessages(initialMessages)
  }

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);


  useEffect(() => {
    // Log the new message when it is receive
    console.log("New message received:", data);
  }, [messages]); // Trigger when messages change

  return (
    <div className="flex flex-row h-[90dvh] w-full space-y-4 lg:space-y-0 lg:space-x-4 p-4 bg-gray-100">
      <div className="flex-1 flex flex-col rounded-2xl border bg-white shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <MessageSquare className="mr-2" /> AskFahd
          </h2>
        </div>
        <div className="flex-1 p-2 overflow-x-hidden" ref={containerRef}>
          {messages.map(({ id, role, content, data }: Message) => (
            <ChatLine key={id} role={role} content={content} sources={data} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              value={input}
              placeholder="Type to chat with AI..."
              onChange={handleInputChange}
              className="flex-grow"
            />
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 sm:flex-none" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLoading ? "Thinking..." : "Ask"}
              </Button>
              <Button onClick={handleReset} type="reset" variant="outline" className="flex-1 sm:flex-none">
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

