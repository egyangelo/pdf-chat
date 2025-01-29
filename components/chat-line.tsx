import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "./ui/button"
import type { Message } from "ai/react"
import ReactMarkdown from "react-markdown"
import { formattedText } from "@/lib/utils"
import { useState } from "react"

interface ChatLineProps {
  role?: string;
  content: string;
  data: any;
}

export function ChatLine({ role = "assistant", content, data }: ChatLineProps) {
  if (!content) {
    return null;
  }

  const sources = JSON.stringify(data)
  const [sourceUrlPDF, setSourceUrlPDF] = useState(null)

  const isUser = role !== "assistant"

  const handleSourceSelect = () => {
    setSourceUrlPDF(null)
  }


  return (
    <div className={`flex w-full m-2 p-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <Card className={`max-w-[90%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <CardHeader className={`flex ${!isUser ? "flex-row" : "flex-row-reverse"} items-center gap-2 p-2`}>
          <Image
            src={isUser ? "/user-avatar.png" : "/ai-avatar.png"}
            alt={isUser ? "User Avatar" : "AI Avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold">{isUser ? "You" : "AI Assistant"}</h3>
          </div>
        </CardHeader>
        <CardContent className="text-sm prose dark:prose-invert max-w-none p-4">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" />
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-4" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-4" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-4" />,
              li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto">
                  <table {...props} className="min-w-full divide-y divide-gray-200 mb-4" />
                </div>
              ),
              th: ({ node, ...props }) => <th {...props} className="px-4 py-2 bg-gray-100 dark:bg-gray-800" />,
              td: ({ node, ...props }) => <td {...props} className="px-4 py-2 border" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
        {role == "assistant" &&
          <CardFooter className="mb-0">
            <Button
              variant="outline"
              className="m-0"
              onClick={handleSourceSelect}>
              source - 1
            </Button>
          </CardFooter>}
      </Card>
    </div>
  )
}

