import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import axios from "axios";

export type PDFSource = {
  type: "url" | "local" | "buffer";
  source: string | Buffer;
  filename: string;
};

export async function getChunkedDocsFromPDF(pdfSource: PDFSource) {
  let docs: Document[] = [];

  try {
    switch (pdfSource.type) {
      case "url": {
        // Download PDF from URL
        const response = await axios.get(pdfSource.source as string, {
          responseType: "arraybuffer",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const loader = new WebPDFLoader(pdfBlob);
        docs = await loader.load();
        break;
      }
      case "local": {
        // Handle local file system PDF using PDFLoader
        const loader = new PDFLoader(pdfSource.source as string);
        docs = await loader.load();
        break;
      }
      case "buffer": {
        // Handle Buffer (e.g., from fs.readFile)
        const pdfBlob = new Blob([pdfSource.source as Buffer], {
          type: "application/pdf",
        });
        const loader = new WebPDFLoader(pdfBlob);
        docs = await loader.load();
        break;
      }
      default:
        throw new Error("Unsupported PDF source type");
    }

    // Split into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
    
    // Add filename prefix to document IDs
    return chunkedDocs.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        chunk_id: `${pdfSource.filename}_chunk_${index + 1}`,
        filename: pdfSource.filename,
        fileurl: typeof pdfSource.source === 'string' ? pdfSource.source : undefined
      }
    }));
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed!");
  }
}

export async function getChunkedDocsFromMultiplePDFs(pdfSources: PDFSource[]) {
  let allDocs: Document[] = [];

  try {
    // Process each PDF source
    for (const pdfSource of pdfSources) {
      let docs: Document[] = [];
      
      switch (pdfSource.type) {
        case "url": {
          const response = await axios.get(pdfSource.source as string, {
            responseType: "arraybuffer",
          });
          const pdfBlob = new Blob([response.data], { type: "application/pdf" });
          const loader = new WebPDFLoader(pdfBlob);
          docs = await loader.load();
          break;
        }
        case "local": {
          const loader = new PDFLoader(pdfSource.source as string);
          docs = await loader.load();
          break;
        }
        case "buffer": {
          const pdfBlob = new Blob([pdfSource.source as Buffer], {
            type: "application/pdf",
          });
          const loader = new WebPDFLoader(pdfBlob);
          docs = await loader.load();
          break;
        }
        default:
          throw new Error("Unsupported PDF source type");
      }
      
      allDocs = [...allDocs, ...docs];
    }

    // Split into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(allDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed!");
  }
}
