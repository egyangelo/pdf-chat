import { env } from "./config";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

export async function embedAndStoreDocs(
  client: PineconeClient,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore(client: PineconeClient) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}


export async function deletePineconeVectorsWithAuthor() {
  const pineconeClient = await pineconeClient();
  const index = pineconeClient.Index(env.PINECONE_INDEX_NAME);

  const filter = {
    filter: {
      "$and": [
        { "pdf.info.Author": "Mohanad Saleh Ba-Azzim" }
      ]
    }
  };

  try {
    const response = await index.deleteByFilter(filter);
    if (response.status === 200) {
      console.log(`Deleted vectors with Author: ${filter.filter["$and"][0]["pdf.info.Author"]}`);
    } else {
      console.error("Deletion failed:", response);
    }
  } catch (error) {
    console.error("Error deleting vectors:", error);
  }
}
