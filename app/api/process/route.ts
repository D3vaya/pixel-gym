import { NextRequest } from "next/server";
import sharp from "sharp";
import { branding } from "@/branding.config";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const {
  quality: QUALITY,
  effort: EFFORT,
  maxFileBytes: MAX_FILE_BYTES,
  maxDimension: MAX_DIMENSION,
  allowedMime,
} = branding.processing;

const ALLOWED_MIME = new Set<string>(allowedMime);

type ErrorCode =
  | "INVALID_FORM"
  | "NO_FILE"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_TYPE"
  | "DECODE_FAILED"
  | "IMAGE_TOO_LARGE"
  | "INTERNAL";

function errorBody(code: ErrorCode, message: string, details?: Record<string, unknown>) {
  return { error: { code, message, ...(details && { details }) } };
}

function jsonError(code: ErrorCode, message: string, status: number, details?: Record<string, unknown>) {
  return Response.json(errorBody(code, message, details), { status });
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonError("INVALID_FORM", "Request body is not valid multipart/form-data.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("NO_FILE", 'Missing required field "file".', 400);
  }

  if (file.size === 0) {
    return jsonError("NO_FILE", "File is empty.", 400);
  }

  if (file.size > MAX_FILE_BYTES) {
    return jsonError(
      "FILE_TOO_LARGE",
      `File exceeds maximum size of ${MAX_FILE_BYTES / (1024 * 1024)} MB.`,
      413,
      { size: file.size, max: MAX_FILE_BYTES },
    );
  }

  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return jsonError(
      "UNSUPPORTED_TYPE",
      `Content type "${file.type}" is not a supported image format.`,
      415,
      { allowed: Array.from(ALLOWED_MIME) },
    );
  }

  let inputBuffer: Buffer;
  try {
    inputBuffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return jsonError("INTERNAL", "Could not read uploaded file.", 500);
  }

  let webp: Buffer;
  try {
    const pipeline = sharp(inputBuffer, {
      failOn: "error",
      limitInputPixels: MAX_DIMENSION * MAX_DIMENSION,
    });
    const meta = await pipeline.metadata();

    if (
      typeof meta.width === "number" &&
      typeof meta.height === "number" &&
      (meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION)
    ) {
      return jsonError(
        "IMAGE_TOO_LARGE",
        `Image dimensions exceed ${MAX_DIMENSION}px on one side.`,
        422,
        { width: meta.width, height: meta.height, max: MAX_DIMENSION },
      );
    }

    webp = await pipeline
      .rotate()
      .webp({ quality: QUALITY, effort: EFFORT, smartSubsample: true })
      .toBuffer();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown decoding error";
    return jsonError("DECODE_FAILED", `Could not decode image: ${msg}`, 422);
  }

  return new Response(new Uint8Array(webp), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(webp.length),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Original-Bytes": String(file.size),
      "X-Webp-Bytes": String(webp.length),
    },
  });
}

export async function GET() {
  return jsonError("INVALID_FORM", "Method not allowed. Use POST.", 405);
}
