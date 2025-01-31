"use server";

import { getChunkedDocsFromPDF, PDFSource } from "@/lib/pdf-loader";
import { embedAndStoreDocs } from "@/lib/vector-store";
import { getPineconeClient } from "@/lib/pinecone-client";

export async function prepare(pdfSources: PDFSource[]) {
  try {
    const client = await getPineconeClient();
    
    for (const pdfSource of pdfSources) {
      console.log(`Processing ${pdfSource.filename}...`);
      
      const docs = await getChunkedDocsFromPDF(pdfSource);
      console.log(`Got ${docs.length} chunks from ${pdfSource.filename}`);
      
      await embedAndStoreDocs(client, docs, pdfSource.filename);
      console.log(`Successfully embedded ${pdfSource.filename}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in prepare:", error);
    throw error;
  }
}
