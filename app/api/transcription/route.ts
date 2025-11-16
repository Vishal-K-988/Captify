import { NextResponse } from "next/server";

export async function POST (req: Request) {

    try {
        const body = await req.json(); 
        const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing AssemblyAI API key" }, { status: 500 });
        }

        const res = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: {
                authorization: apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        return NextResponse.json(data)
    }
    catch (error) {
        console.log ("error occured while Transcribing , error : " , error );
        return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }
}