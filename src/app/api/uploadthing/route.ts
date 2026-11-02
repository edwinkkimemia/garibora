import { createRouteHandler } from "uploadthing/next";
import { carRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({ router: carRouter });
