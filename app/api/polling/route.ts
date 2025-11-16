import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing AssemblyAI API key" }, { status: 500 });
    }

    while (true) {
      const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        method: "GET",
        headers: {
          authorization: apiKey,
        },
      });

      const data = await res.json();

      if (data.status === "completed") {
        // Return full response including words array for caption timing
        return NextResponse.json({ 
          text: data.text,
          words: data.words || [],
          status: data.status,
          ...data
        });
      }

      if (data.status === "error") {
        return NextResponse.json(
          { error: `Transcription failed: ${data.error}` },
          { status: 500 }
        );
      }

      // wait 3 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } catch (error) {
    console.error("Polling error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
