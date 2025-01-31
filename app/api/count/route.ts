import { NextRequest, NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone-client";
import { countVectorsByFilename, getVectorIdsByFilename } from "@/lib/vector-store";

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();
    const client = await getPineconeClient();
    if (client) console.log("Pinecone client created");
    
    const count = await countVectorsByFilename(client, filename);

    // Get the IDs of the vectors as well
    const ids = await getVectorIdsByFilename(client, filename);

    return NextResponse.json({ count, ids });
  } catch (error) {
    console.error("Count vectors error:", error);
    return NextResponse.json({ error: "Failed to count vectors" }, { status: 500 });
  }
} 