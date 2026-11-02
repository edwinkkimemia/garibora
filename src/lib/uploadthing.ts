import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

/**
 * Uploadthing router for marketplace photos.
 * Requires UPLOADTHING_TOKEN (server) — see .env.example.
 * When the token is missing, forms fall back to pasting image URLs.
 */
export const carRouter = {
  carImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 12 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Please log in to upload photos.");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type CarRouter = typeof carRouter;
