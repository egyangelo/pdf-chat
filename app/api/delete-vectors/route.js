import { getPineconeClient } from "@/lib/pinecone-client";
import { env } from "@/lib/config";

export async function POST(req) {
  const { author } = await req.json();

  if (!author) {
    return new Response(
      JSON.stringify({ message: "Author is required" }),
      { status: 400 }
    );
  }

  try {
    const pineconeClient = await getPineconeClient();
    const index = pineconeClient.Index(env.PINECONE_INDEX_NAME);

    const filter = {
      filter: {
        "$and": [{ "pdf.info.Author": author }],
      },
    };

    const response = await index.deleteByFilter(filter);

    return new Response(
      JSON.stringify({
        message: `Deleted vectors with Author: ${author}`,
        response,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting vectors:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting vectors", error }),
      { status: 500 }
    );
  }
}
