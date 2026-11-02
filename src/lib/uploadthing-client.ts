"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { CarRouter } from "./uploadthing";

export const UploadButton = generateUploadButton<CarRouter>();
