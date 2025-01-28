import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    // Validate environment variables
    if (!env.PINECONE_API_KEY || !env.PINECONE_INDEX_NAME) {
      throw new Error("Missing Pinecone API Key or Index Name in environment configuration.");
    }

    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    // Check if the index exists or create it
    const indexName = env.PINECONE_INDEX_NAME;

    try {
      const index = pineconeClient.Index(indexName); // Attempt to retrieve the index
      console.log(`Pinecone index '${indexName}' found and ready.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding index '${indexName}':`, error.message);
      }
      // Index not found, create a new one
      await pineconeClient.createIndex({
        name: indexName,
        dimension: 1536, // Ensure this matches your embedding vector size
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
        suppressConflicts: true, // Suppresses errors if the index already exists
        waitUntilReady: true, // Waits until the index is ready
      });
      console.log(`Pinecone index '${indexName}' created successfully.`);
    }

    return pineconeClient;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to initialize Pinecone Client:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  const pineconeClientInstance = await initPineconeClient();
  return pineconeClientInstance;
}
