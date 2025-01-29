import Balancer from "react-wrap-balancer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import { formattedText } from "@/lib/utils";

interface ChatLineProps extends Partial<Message> {
  sources: string[];
}

export function ChatLine({
  role = "assistant",
  content,
  sources,
}: ChatLineProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role != "assistant"
                ? "text-amber-500 dark:text-amber-200"
                : "text-blue-500 dark:text-blue-200"
            }
          >
            {role == "assistant" ? "AI" : "You"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-4" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-4 mb-4" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-4 mb-4" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-1" />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto">
                  <table {...props} className="min-w-full divide-y divide-gray-200 mb-4" />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th {...props} className="px-4 py-2 bg-gray-100 dark:bg-gray-800" />
              ),
              td: ({ node, ...props }) => (
                <td {...props} className="px-4 py-2 border" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" />
                          ),
                        }}
                      >
                        {formattedText(source)}
                      </ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
