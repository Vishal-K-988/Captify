import { NextResponse } from "next/server";

const GEMINI_MODEL = "veo-1.5";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiRequestBody {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  referenceText?: string;
}

type GeminiPart = {
  fileData?: { fileUri?: string };
  media?: { url?: string };
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  session?: { video?: { uri?: string } };
  output?: { video?: { uri?: string } };
  generatedFiles?: Array<{ fileUri?: string }>;
  requestId?: string;
  error?: { message?: string };
};

const extractVideoUri = (data: GeminiResponse | null | undefined): string | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidateParts =
    data.candidates?.flatMap((candidate) => candidate?.content?.parts ?? []) ?? [];

  const filePart = candidateParts.find(
    (part) => part?.fileData?.fileUri || part?.media?.url
  );

  if (filePart?.fileData?.fileUri) {
    return filePart.fileData.fileUri;
  }

  if (filePart?.media?.url) {
    return filePart.media.url;
  }

  const videoUri =
    data?.session?.video?.uri ||
    data?.output?.video?.uri ||
    data?.generatedFiles?.[0]?.fileUri;

  if (videoUri) {
    return videoUri;
  }

  return null;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as GeminiRequestBody;
    const { prompt, duration = 5, aspectRatio = "9:16", referenceText } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const generationPrompt = [
      prompt,
      referenceText
        ? `Context from original video: ${referenceText}`
        : null,
      `Desired duration: ${duration} seconds.`,
      `Aspect ratio: ${aspectRatio}.`,
      "Output should be a short B-roll clip suitable for social media overlays.",
    ]
      .filter(Boolean)
      .join(" ");

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: generationPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "video/mp4",
        temperature: 0.4,
      },
    };

    let apiResponse: Response | null = null;
    let apiPayload: GeminiResponse | null = null;
    let videoUrl: string | null = null;
    let warning: string | undefined;

    try {
      apiResponse = await fetch(
        `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const rawPayload = await apiResponse.json().catch(() => null);
      apiPayload =
        rawPayload && typeof rawPayload === "object"
          ? (rawPayload as GeminiResponse)
          : null;

      if (apiResponse.ok) {
        videoUrl = extractVideoUri(apiPayload);
      } else {
        const apiErrorMessage =
          apiPayload?.error?.message ??
          `Gemini API responded with ${apiResponse.status}`;
        warning = apiErrorMessage;
        console.warn("Gemini API warning:", warning, apiPayload);
      }
    } catch (apiError) {
      warning = "Gemini request failed";
      console.warn("Gemini API request failed:", apiError);
    }

    if (!videoUrl) {
      videoUrl =
        "https://storage.googleapis.com/generativeai-downloads/data/GoogleIO.mp4";
    }

    return NextResponse.json({
      videoUrl,
      raw: apiPayload,
      requestId: apiPayload?.requestId ?? crypto.randomUUID(),
      warning,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Unable to generate B-roll" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

