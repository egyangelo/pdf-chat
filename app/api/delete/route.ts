import { NextRequest, NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone-client";
import { deleteVectorsByFilename } from "@/lib/vector-store";

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();
    const client = await getPineconeClient();
    await deleteVectorsByFilename(client, filename);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vectors error:", error);
    return NextResponse.json({ error: "Failed to delete vectors" }, { status: 500 });
  }
} 