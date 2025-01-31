import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { VectorStore } from "@langchain/core/vectorstores";

interface ProcessMessageArgs {
  userPrompt: string;
  conversationHistory: string;
  vectorStore: VectorStore;
  model: ChatOpenAI;
}

interface ProcessMessageResponse {
  answer: string;
  inquiry: string;
}

export async function processUserMessage({
  userPrompt,
  conversationHistory,
  vectorStore,
  model,
}: ProcessMessageArgs) {
  try {
    // Create non-streaming model for inquiry generation
    const nonStreamingModel = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      streaming: false,
    });

    // Generate focused inquiry using non-streaming model
    const inquiryResult = await inquiryPrompt
      .pipe(nonStreamingModel)
      .pipe(new StringOutputParser())
      .invoke({
        userPrompt,
        conversationHistory,
      });

    // Get relevant documents
    const relevantDocs = await vectorStore.similaritySearch(inquiryResult, 5);
    const context = relevantDocs.map((doc) => {

      // Extract page number safely
      const pageNumber = doc.metadata?.['loc.pageNumber']
      const fileName = doc.metadata.filename
      const fileurl = doc.metadata.fileurl

      return {
        pageContent: doc.pageContent,
        meta: {
          source_name: `${fileName}-Page${pageNumber}`,
          source_url: `${fileurl}#page=${pageNumber}`,
        },
      };
    });

    // console.log("----------- Context ----------------", context)

    return qaPrompt.pipe(model).pipe(new StringOutputParser()).stream({
      context,
      question: inquiryResult,
    });

  } catch (error) {
    console.error("Error processing message:", error);
    throw new Error("Failed to process your message");
  }
}

// Updated prompt templates
const inquiryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
    
    Rules:
    - Always prioritize the user prompt over the conversation log
    - Ignore any conversation log that is not directly related to the user prompt
    - Remove any words that are not relevant to the question
    - If unable to formulate a question, respond with the same USER PROMPT received`,
  ],
  [
    "human",
    `USER PROMPT: {userPrompt}\n\nCONVERSATION LOG: {conversationHistory}`,
  ],
]);

const qaPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an AI assistant specialized in providing accurate, context-based responses. Analyze the provided context carefully and follow these guidelines:

    **CORE RESPONSIBILITIES:**
    - Base responses **ONLY** on the provided context.
    - **ALWAYS** cite specific parts of the context, including:
      - **File Name**
      - **Page Number (if applicable)**
      - **Clause Number (if applicable)**
    - Maintain high accuracy and transparency.
    - Acknowledge limitations clearly.

    **RESPONSE FORMAT:**
    - **Use bullet points whenever possible.**
    - If an equation is present, format it in **markdown.**
    - If a table is present in the context, format it properly in markdown.
    - **Every key claim or fact must be cited** using the source metadata.

    **EXAMPLES OF HOW TO CITE SOURCES:**
    - "According to *document_name.pdf*, page **3**, clause **5.2**: ..."
    - "As mentioned in *source.pdf*, page **10**: ..."
    - "This information comes from *report.pdf*, page **7**, section **4.3**: ..."

    **IMPORTANT RULES:**
    - **Never make up information not present in the context.**
    - **ALWAYS cite specific parts of the context to support answers.**
    - If the context is insufficient, **explicitly state what's missing.**
    - Ask for clarification if the question is ambiguous.

    **Provided Context:**
    {context}`,
  ],
  ["human", "Question: {question}"],
]);
