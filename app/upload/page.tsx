"use client";
import { prepare } from "@/actions/prepare";
import PDFFileUpload, { FileProps } from "@/components/PDFFileUploader";
import { Button } from "@/components/ui/button";
import { PDFSource } from "@/lib/pdf-loader";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { metadata } from "../layout";

export default function Page() {
  const [files, setFiles] = useState<FileProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  async function submit() {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    try {
      setLoading(true);
      setLoadingMsg("Processing files...");

      const pdfSources: PDFSource[] = files.map(file => ({
        type: "url",
        source: file.url,
        filename: file.title
      }));

      for (let i = 0; i < pdfSources.length; i++) {
        setLoadingMsg(`Processing file ${i + 1} of ${pdfSources.length}: ${pdfSources[i].filename}`);
        await prepare([pdfSources[i]]); // Process one file at a time
      }

      toast.success("All files processed successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process files. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  return (
    <div>
      <div className="flex flex-1 py-16">
        <div className="w-full max-w-2xl mx-auto">
          {files.length > 0 ? (
            <>
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Button disabled className="flex gap-2">
                    <Loader2 className="animate-spin" />
                    Processing...
                  </Button>
                  <p className="text-sm text-gray-500">{loadingMsg}</p>
                </div>
              ) : (
                <Button onClick={submit}>Upload to Pinecone</Button>
              )}
            </>
          ) : (
            <PDFFileUpload
              label="Upload your Knowledge Base PDF"
              files={files}
              setFiles={setFiles}
              endpoint="pdfUpload"
            />
          )}
        </div>
      </div>
    </div>
  );
}