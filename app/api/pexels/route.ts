export async function POST (req: Request) {

    try {
        const baseURL = "https://api.pexels.com/videos/search" ;
        // Parse all parameters at once - request body can only be read once
        const {query , orientation, size } = await req.json();

        const PexelsAPIKey = process.env.NEXT_PUBLIC_PEXELS_KEY;

        if (!PexelsAPIKey) {
            console.error("Pexels API key is missing from environment variables");
            return Response.json({ error: "Missing Pexels API key" }, { status: 500 });
        }

        if (!query) {
            return Response.json({ error: "Query parameter is required" }, { status: 400 });
        }

        const url = new URL(baseURL);
        url.searchParams.set("query", query);
        
        // Orientation: portrait, landscape, or square (as per Pexels API docs)
        if (orientation && ["portrait", "landscape", "square"].includes(orientation)) {
            url.searchParams.set("orientation", orientation);
        }
        
        // Note: "size" parameter may not be valid for video search API (only for photo search)
        // But including it in case the API accepts it
        if (size && ["small", "medium", "large"].includes(size)) {
            url.searchParams.set("size", size);
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: PexelsAPIKey,
            },
          });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Pexels API error: ${res.status} ${res.statusText}`, errorText);
            return Response.json({ 
                error: `Pexels API error: ${res.status} ${res.statusText}`,
                details: errorText 
            }, { status: res.status });
        }

        const data = await res.json();

        return Response.json(data);
    

    } catch (error) {
        console.error("Pexels API request failed", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return Response.json({ 
            error: "Internal Server Error / There might be an issue with the API key",
            details: errorMessage 
        }, { status: 500 });
    }
}