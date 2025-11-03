import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, variables, message, context } = body;

    // Handle both formats: variables object OR message/context
    if (!variables && !message && !context) {
      return NextResponse.json(
        { error: "Either 'variables' or 'message/context' required" },
        { status: 400 }
      );
    }

    // This endpoint is for logging only
    // Actual context updates are done via conversation.sendContextualUpdate() on the frontend
    console.log("🎙️ Karen Context Update:", {
      conversationId: conversationId || "none",
      message: message || "variables update",
      context: context || variables,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Context update logged successfully",
      data: {
        message,
        context: context || variables,
      },
    });
  } catch (error) {
    console.error("❌ Error in update-context:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
