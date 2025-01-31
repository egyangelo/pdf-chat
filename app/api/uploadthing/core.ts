import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  pdfUpload: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 50 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "AskFahd" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
