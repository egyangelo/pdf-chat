import { env } from "./config";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

// Helper function to generate a unique file ID
function generateFileId(filename: string): string {
  const prefix = filename || 'file';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export async function embedAndStoreDocs(
  client: PineconeClient,
  docs: Document[],
  filename: string
) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);
    const fileId = generateFileId(filename);

    // Add metadata to each document
    const docsWithMetadata = docs.map((doc, index) => ({
      ...doc,
      metadata: {
        filename,
        fileId,
        chunk: index + 1,
        totalChunks: docs.length,
        source: "pdf",
        timestamp: new Date().toISOString()
      }
    }));

    // Embed and store the documents with metadata
    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return { success: true, fileId };
  } catch (error) {
    console.error("Error embedding docs:", error);
    throw new Error("Failed to load your docs!");
  }
}

// For handling multiple files
export async function embedAndStoreMultipleDocs(
  client: PineconeClient,
  fileDocuments: { docs: Document[], filename: string }[]
) {
  try {
    const results = [];
    for (const { docs, filename } of fileDocuments) {
      const result = await embedAndStoreDocs(client, docs, filename);
      results.push({ filename, fileId: result.fileId });
    }
    return results;
  } catch (error) {
    console.error("Error embedding multiple docs:", error);
    throw new Error("Failed to load one or more documents!");
  }
}

export async function getVectorStore(
  client: PineconeClient, 
  options?: { 
    filename?: string;
    fileId?: string;
  }
) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    let filter;
    if (options?.fileId) {
      filter = { fileId: options.fileId };
    } else if (options?.filename) {
      filter = { filename: options.filename };
    }

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      filter
    });

    return vectorStore;
  } catch (error) {
    console.error("Error getting vector store:", error);
    throw new Error("Something went wrong while getting vector store!");
  }
}

export async function deleteVectorsByFileId(client: PineconeClient, fileId: string) {
  try {
    const index = client.Index(env.PINECONE_INDEX_NAME);
    
    const deleteFilter = {
      filter: {
        fileId: { $eq: fileId }
      }
    };

    await index.deleteMany(deleteFilter);
    console.log(`Deleted vectors for fileId: ${fileId}`);
    return true;
  } catch (error) {
    console.error("Error deleting vectors:", error);
    throw new Error(`Failed to delete vectors for fileId: ${fileId}`);
  }
}

export async function deleteVectorsByFilename(client: PineconeClient, filename: string) {
  try {
    const index = client.Index(env.PINECONE_INDEX_NAME);
    
    const deleteFilter = {
      filter: {
        filename: { $eq: filename }
      }
    };

    await index.deleteMany(deleteFilter);
    console.log(`Deleted vectors for file: ${filename}`);
    return true;
  } catch (error) {
    console.error("Error deleting vectors:", error);
    throw new Error(`Failed to delete vectors for file: ${filename}`);
  }
}

