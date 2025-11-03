import { NextRequest, NextResponse } from "next/server";
import { sessionStore } from "../../../../../utils/sessionStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  if (!sessionId) {
    return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  const session = sessionStore.get(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}
