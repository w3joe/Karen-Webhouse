"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useRef, useState } from "react";

export default function WallOfShameGallery() {
  // Fetch roasts for the wall
  const recentRoasts = useQuery(api.roasts.getSplashPageRoasts, { limit: 40 });
  
  // Parallax state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate roasts for infinite scroll effect
  const duplicatedRoasts = recentRoasts 
    ? [...recentRoasts, ...recentRoasts, ...recentRoasts] 
    : [];

  // Split into 3 rows for alternating scroll directions
  const getRowRoasts = (rowIndex: number) => {
    if (!duplicatedRoasts.length) return [];
    const itemsPerRow = Math.ceil(duplicatedRoasts.length / 3);
    return duplicatedRoasts.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow);
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return "bg-red-500";
    if (rating <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!recentRoasts || recentRoasts.length === 0) {
    return null; // Don't show gallery if no roasts yet
  }

  // Calculate parallax offsets for each row
  const parallaxOffset1 = mousePosition.x * 30; // Fastest
  const parallaxOffset2 = mousePosition.x * 20; // Medium
  const parallaxOffset3 = mousePosition.x * 10; // Slowest

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-hidden py-8 space-y-6 opacity-30"
      style={{
        transform: `translateY(${mousePosition.y * 20}px)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      {/* Row 1 - Scroll Left to Right + Parallax */}
      <div 
        className="scroll-row-ltr"
        style={{
          transform: `translateX(${parallaxOffset1}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="scroll-content">
          {getRowRoasts(0).map((roast, index) => (
            <div
              key={`${roast._id}-${index}`}
              className="wall-card group"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-800">
                {roast.screenshotUrl ? (
                  <img
                    src={roast.screenshotUrl}
                    alt={roast.url}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
                )}
                
                {/* Score Overlay on Hover */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {(roast as any).overallRating || 0}
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">/10</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Scroll Right to Left + Parallax */}
      <div 
        className="scroll-row-rtl"
        style={{
          transform: `translateX(${parallaxOffset2}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="scroll-content">
          {getRowRoasts(1).map((roast, index) => (
            <div
              key={`${roast._id}-${index}`}
              className="wall-card group"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-800">
                {roast.screenshotUrl ? (
                  <img
                    src={roast.screenshotUrl}
                    alt={roast.url}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
                )}
                
                {/* Score Overlay on Hover */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {(roast as any).overallRating || 0}
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">/10</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 - Scroll Left to Right + Parallax */}
      <div 
        className="scroll-row-ltr-slow"
        style={{
          transform: `translateX(${parallaxOffset3}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="scroll-content">
          {getRowRoasts(2).map((roast, index) => (
            <div
              key={`${roast._id}-${index}`}
              className="wall-card group"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-800">
                {roast.screenshotUrl ? (
                  <img
                    src={roast.screenshotUrl}
                    alt={roast.url}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
                )}
                
                {/* Score Overlay on Hover */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {(roast as any).overallRating || 0}
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">/10</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scroll-row-ltr,
        .scroll-row-rtl,
        .scroll-row-ltr-slow {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .scroll-row-ltr:hover .scroll-content,
        .scroll-row-rtl:hover .scroll-content,
        .scroll-row-ltr-slow:hover .scroll-content {
          animation-play-state: paused;
        }

        .scroll-content {
          display: flex;
          gap: 1.5rem;
          width: max-content;
        }

        .scroll-row-ltr .scroll-content {
          animation: scroll-left 60s linear infinite;
        }

        .scroll-row-rtl .scroll-content {
          animation: scroll-right 60s linear infinite;
        }

        .scroll-row-ltr-slow .scroll-content {
          animation: scroll-left 80s linear infinite;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .wall-card {
          flex-shrink: 0;
          width: 320px;
          height: 320px;
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 1rem;
          overflow: hidden;
          cursor: default;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .wall-card:hover {
          transform: scale(1.15);
          opacity: 1;
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.4),
                      0 10px 10px -5px rgba(236, 72, 153, 0.3);
        }

        @media (max-width: 768px) {
          .wall-card {
            width: 250px;
            height: 250px;
          }

          .scroll-row-rtl,
          .scroll-row-ltr-slow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
