import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

export function ChatLine({ role = "assistant", content }) {
  if (!content) {
    return null
  }

  const isUser = role !== "assistant"

  return (
    <div className={`flex w-full m-2 p-2 justify-start items-start`}>
      <div className="hidden md:block">
        <Image
          src={isUser ? "/user-avatar.png" : "/ai-avatar.png"}
          alt={isUser ? "User Avatar" : "AI Avatar"}
          width={40}
          height={40}
          className="rounded-full m-2"
        />
      </div>
      <Card className={`max-w-[90%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <CardHeader
          className={`flex items-center gap-2 p-2 ${!isUser ? "flex-row" : "flex-row-reverse"} `}
        ></CardHeader>
        <CardContent className="text-sm prose dark:prose-invert p-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
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
                  <table {...props} className="min-w-full divide-y divide-gray-200 mb-4 border border-gray-300" />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th {...props} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300" />
              ),
              td: ({ node, ...props }) => <td {...props} className="px-4 py-2 border border-gray-300" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  )
}

