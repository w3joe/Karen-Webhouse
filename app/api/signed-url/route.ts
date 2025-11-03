import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
      return NextResponse.json(
        {
          error: "ElevenLabs configuration missing",
        },
        { status: 500 }
      );
    }

    // Call ElevenLabs API to get a signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return NextResponse.json(
        {
          error: "Failed to get signed URL from ElevenLabs",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
