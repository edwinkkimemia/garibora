"use client";

import { generateUploadButton, generateReactHelpers } from "@uploadthing/react";
import type { CarRouter } from "./uploadthing";

export const UploadButton = generateUploadButton<CarRouter>();
export const { useUploadThing } = generateReactHelpers<CarRouter>();
