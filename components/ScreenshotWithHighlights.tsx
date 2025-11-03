"use client";

import { useEffect, useRef, useState } from "react";
import { DesignFlaw } from "../types";

interface ScreenshotWithHighlightsProps {
  screenshot: string;
  designFlaws: DesignFlaw[];
  currentIssueIndex: number;
  onIssueClick?: (index: number) => void;
}

export default function ScreenshotWithHighlights({
  screenshot,
  designFlaws,
  currentIssueIndex,
  onIssueClick,
}: ScreenshotWithHighlightsProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  // Track image dimensions for accurate positioning
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const updateDimensions = () => {
      setImageDimensions({
        width: img.clientWidth,
        height: img.clientHeight,
      });
    };

    if (img.complete) {
      updateDimensions();
      setImageLoaded(true);
    }

    img.addEventListener("load", updateDimensions);
    window.addEventListener("resize", updateDimensions);

    return () => {
      img.removeEventListener("load", updateDimensions);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [screenshot]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "#ef4444"; // red
      case "high":
        return "#f97316"; // orange
      case "medium":
        return "#eab308"; // yellow
      case "low":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  const getSeverityLabel = (severity: string): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  // Debug screenshot data
  useEffect(() => {
    console.log("📸 Screenshot data:", screenshot?.substring(0, 100));
    console.log("📸 Screenshot length:", screenshot?.length);
  }, [screenshot]);

  return (
    <div className="relative w-full">
      {/* Screenshot image */}
      <img
        ref={imageRef}
        src={screenshot}
        alt="Website Screenshot"
        className="w-full rounded-lg shadow-md"
        onLoad={() => {
          console.log("✅ Screenshot loaded successfully");
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error("❌ Screenshot failed to load:", e);
          console.error("Screenshot src:", screenshot?.substring(0, 100));
        }}
      />

      {/* SVG overlay for highlights */}
      {imageLoaded && imageDimensions.width > 0 && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow filter for highlights */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render all issue boxes */}
          {designFlaws.map((flaw, index) => {
            const isActive = index === currentIssueIndex;
            const color = getSeverityColor(flaw.severity);
            const scaleX = imageDimensions.width / 1920; // Assuming screenshot was taken at 1920px width
            const scaleY =
              imageDimensions.height /
              (1920 * (flaw.coordinates.height / flaw.coordinates.width)); // Maintain aspect ratio

            const x = flaw.coordinates.x * scaleX;
            const y = flaw.coordinates.y * scaleY;
            const width = flaw.coordinates.width * scaleX;
            const height = flaw.coordinates.height * scaleY;

            return (
              <g
                key={index}
                className={`transition-opacity duration-400 ${
                  isActive ? "opacity-100" : "opacity-30"
                }`}
                onClick={() => onIssueClick?.(index)}
                style={{ cursor: onIssueClick ? "pointer" : "default" }}
              >
                {/* Main rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="none"
                  stroke={color}
                  strokeWidth={isActive ? 3 : 2}
                  rx={4}
                  filter={isActive ? "url(#glow)" : undefined}
                  className="transition-all duration-400"
                  style={{
                    strokeDasharray: isActive ? "none" : "8 4",
                  }}
                />

                {/* Corner accents for active issue */}
                {isActive && (
                  <>
                    {/* Top-left corner */}
                    <path
                      d={`M ${x} ${y + 15} L ${x} ${y} L ${x + 15} ${y}`}
                      stroke={color}
                      strokeWidth={3}
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Top-right corner */}
                    <path
                      d={`M ${x + width - 15} ${y} L ${x + width} ${y} L ${
                        x + width
                      } ${y + 15}`}
                      stroke={color}
                      strokeWidth={3}
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Bottom-left corner */}
                    <path
                      d={`M ${x} ${y + height - 15} L ${x} ${y + height} L ${
                        x + 15
                      } ${y + height}`}
                      stroke={color}
                      strokeWidth={3}
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Bottom-right corner */}
                    <path
                      d={`M ${x + width - 15} ${y + height} L ${x + width} ${
                        y + height
                      } L ${x + width} ${y + height - 15}`}
                      stroke={color}
                      strokeWidth={3}
                      fill="none"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Issue number badge */}
                <g transform={`translate(${x + width - 30}, ${y - 12})`}>
                  <rect
                    x={0}
                    y={0}
                    width={24}
                    height={24}
                    rx={12}
                    fill={color}
                    className="transition-all duration-400"
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                        : "none",
                    }}
                  />
                  <text
                    x={12}
                    y={16}
                    textAnchor="middle"
                    fill="white"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {index + 1}
                  </text>
                </g>

                {/* Severity label for active issue */}
                {isActive && (
                  <g transform={`translate(${x}, ${y - 12})`}>
                    <rect
                      x={0}
                      y={0}
                      width={80}
                      height={24}
                      rx={4}
                      fill={color}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                    <text
                      x={40}
                      y={16}
                      textAnchor="middle"
                      fill="white"
                      fontSize={11}
                      fontWeight="600"
                    >
                      {getSeverityLabel(flaw.severity)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
