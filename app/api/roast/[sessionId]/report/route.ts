import { NextRequest, NextResponse } from "next/server";
import { createPDFReport } from "../../../../../utils/pdf";
import { sessionStore } from "../../../../../utils/sessionStore";

export async function POST(
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

  if (session.status !== "complete" || !session.analysis) {
    return NextResponse.json(
      {
        error: "Session not complete or analysis not available",
      },
      { status: 400 }
    );
  }

  try {
    const pdfBuffer = await createPDFReport(session.analysis);

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=karens-roast-${sessionId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
