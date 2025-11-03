"use client";

import { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { RoastSession, AnalysisResults } from "../types";
import MicPermissionModal from "../components/MicPermissionModal";
import SplashPage from "../components/SplashPage";
import AnalyzingPage from "../components/AnalyzingPage";
import RoastingPage from "../components/RoastingPage";
import ReportPage from "../components/ReportPage";
import AudioVisualizer from "../components/AudioVisualizer";

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

export default function Home() {
  // State management
  const [micPermission, setMicPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<
    "splash" | "analyzing" | "roasting" | "report"
  >("splash");
  const [roastSession, setRoastSession] = useState<RoastSession | null>(null);
  const [currentFlawIndex, setCurrentFlawIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversation = useConversation({});

  // Check microphone permission on load
  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission(true);
    } catch {
      setMicPermission(false);
    }
  };

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
    } catch (err) {
      setError(
        "Karen needs your microphone to roast you properly. Don't be shy!"
      );
    }
  };

  useEffect(() => {
    checkMicPermission();
  }, []);

  useEffect(() => {
    if (micPermission && conversation.status === "disconnected") {
      const startConversation = async () => {
        try {
          const signedUrl = await getSignedUrl();

          // Phase 1: Start conversation with no context
          // Karen performs predefined system instructions
          await conversation.startSession({
            signedUrl,
          });

          console.log("Conversation started - Phase 1: Initial greeting");
          console.log("Conversation status:", conversation.status);
        } catch (error) {
          console.error("Failed to start conversation:", error);
        }
      };

      startConversation();
    }
  }, [micPermission, conversation]);

  // Helper function to send user messages to the agent
  const sendUserMessage = async (message: string) => {
    try {
      // Wait for conversation to be ready (not disconnected)
      let retries = 0;
      while (conversation.status === "disconnected" && retries < 10) {
        console.log(
          `Waiting for conversation to connect... (attempt ${retries + 1})`
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }

      if (conversation.status === "disconnected") {
        throw new Error("Conversation failed to connect after 5 seconds");
      }

      console.log("📤 Sending user message...");
      console.log("   Status:", conversation.status);
      console.log("   Message preview:", message.substring(0, 100) + "...");

      await conversation.sendUserMessage(message);
      console.log("✅ User message sent successfully!");
    } catch (err) {
      console.error("❌ Error sending user message:", err);
      console.error("   Status was:", conversation.status);
    }
  };

  // Validate URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Start roast process
  const handleRoastSubmit = async () => {
    if (!url) {
      setError("Are you dumb? Type in a website URL!");
      return;
    }

    if (!isValidUrl(url)) {
      setError("You don't know how to enter a valid URL (e.g., https://example.com)?");
      return;
    }

    setError(null);
    setStage("analyzing");

    try {
      console.log("🚀 PHASE 2: Sending URL to Karen for preliminary roast");
      console.log("   URL:", url);

      // Phase 2: Send URL context to Karen
      // Karen gives preliminary generic roast and converses while loading
      await sendUserMessage(
        `You should see my website: ${url}. Give me a preliminary generic roast and keep the conversation going while the analysis loads.`
      );

      console.log("✅ Phase 2 context sent, starting backend analysis...");

      // Trigger backend analysis
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to start roast analysis");
      }

      const { sessionId } = await response.json();

      // Poll for analysis completion
      pollForAnalysis(sessionId);
    } catch (err) {
      console.error("Error starting roast:", err);
      setError("Failed to start roast. Karen is not amused.");
      setStage("splash");
    }
  };

  // Poll for analysis results
  const pollForAnalysis = async (sessionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/roast/${sessionId}/status`);
        const data: RoastSession = await response.json();

        setRoastSession(data);

        if (data.status === "complete" && data.analysis) {
          clearInterval(pollInterval);

          // Update ElevenLabs agent with analysis results
          await updateAgentWithAnalysis(data.analysis);

          setStage("roasting");
        } else if (data.status === "error") {
          clearInterval(pollInterval);
          setError("Analysis failed. Your website broke Karen's brain.");
          setStage("splash");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  // Update agent context with analysis
  const updateAgentWithAnalysis = async (analysis: AnalysisResults) => {
    try {
      console.log("🎯 PHASE 3: Sending complete analysis to Karen");
      console.log("   Flaws found:", analysis.design_flaws.length);
      console.log("   Overall rating:", analysis.overall_rating);

      // Phase 3: Send complete analysis to Karen
      // Karen will now talk about specific issues
      const contextMessage = `Analysis complete!
      
Website: ${roastSession?.url || "the site"}
Overall Rating: ${analysis.overall_rating}/10
Roast Summary: ${analysis.roast_summary}

Design Flaws Found (${analysis.design_flaws.length}):
${analysis.design_flaws
  .map(
    (flaw, idx) =>
      `${idx + 1}. ${flaw.issue} (Severity: ${flaw.severity})
   Roast: ${flaw.roast}
   Fix: ${flaw.recommendation}`
  )
  .join("\n\n")}

${
  analysis.positive_aspects.length > 0
    ? `\nPositive Aspects:\n${analysis.positive_aspects.join("\n")}`
    : ""
}

Now deliver your full roast based on these specific findings, keep to 1 sentence for summary and go straight into issues.
Reference each issue by number (e.g., "Let's talk about issue number 1") so the UI can highlight them. Keep to 1 roast per issue and fix.
Remember to talk about all issues and end off with a sassy closing line.`;

      await sendUserMessage(contextMessage);

      console.log("✅ Phase 3 complete - Karen has full analysis!");
      console.log("   Agent should now reference specific issues");
    } catch (err) {
      console.error("Failed to update agent context:", err);
    }
  };

  // Transcript is now updated via onMessage callback above
  // No need for polling - real-time updates handled by useConversation hook

  // Download report
  const handleDownloadReport = async () => {
    if (!roastSession?.sessionId) return;

    try {
      const response = await fetch(
        `/api/roast/${roastSession.sessionId}/report`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `karens-roast-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report:", err);
      setError("Failed to download report. Karen is disappointed.");
    }
  };

  // Reset and start over
  const handleStartOver = () => {
    setUrl("");
    setStage("splash");
    setRoastSession(null);
    setCurrentFlawIndex(0);
    setTranscript("");
    conversation.endSession();
  };

  // Render splash page
  if (stage === "splash") {
    return (
      <>
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-purple-900/20 animate-pulse"></div>

          {!micPermission && (
            <MicPermissionModal
              error={error}
              onRequestPermission={requestMicPermission}
            />
          )}

          <div className={`relative z-10 ${!micPermission ? "blur-sm" : ""}`}>
            <SplashPage
              url={url}
              setUrl={setUrl}
              error={error}
              micPermission={micPermission}
              onSubmit={handleRoastSubmit}
            />
          </div>
        </div>
        {micPermission && <AudioVisualizer conversation={conversation} />}
      </>
    );
  }

  // Render analyzing page
  if (stage === "analyzing") {
    return (
      <>
        <AnalyzingPage roastSession={roastSession} transcript={transcript} />
        <AudioVisualizer conversation={conversation} />
      </>
    );
  }

  // Render roasting page
  if (
    stage === "roasting" &&
    roastSession?.analysis &&
    roastSession?.screenshot
  ) {
    return (
      <>
        <RoastingPage
          roastSession={
            roastSession as RoastSession & {
              analysis: NonNullable<RoastSession["analysis"]>;
              screenshot: string;
            }
          }
          currentFlawIndex={currentFlawIndex}
          setCurrentFlawIndex={setCurrentFlawIndex}
          transcript={transcript}
          onViewReport={() => setStage("report")}
          conversation={conversation}
        />
        <AudioVisualizer conversation={conversation} />
      </>
    );
  }

  // Render report page
  if (stage === "report" && roastSession?.analysis) {
    return (
      <>
        <ReportPage
          roastSession={
            roastSession as RoastSession & {
              analysis: NonNullable<RoastSession["analysis"]>;
            }
          }
          onDownloadReport={handleDownloadReport}
          onStartOver={handleStartOver}
        />
        <AudioVisualizer conversation={conversation} />
      </>
    );
  }

  return null;
}
