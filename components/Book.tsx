"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

type TurnDirection = "next" | "prev";

const SPREAD_COUNT = 12; // 12 spreads = 24 pages total
const TURN_DURATION = 900; // ms

const layouts = [
  // Layout 1: Main floor plan with supporting diagrams
  [
    { x: 8, y: 12, w: 48, h: 52, label: "Floor Plan" },
    { x: 62, y: 14, w: 28, h: 22, label: "Section A" },
    { x: 62, y: 42, w: 28, h: 22, label: "Section B" },
  ],
  // Layout 2: Elevations
  [
    { x: 10, y: 8, w: 35, h: 40, label: "North Elevation" },
    { x: 52, y: 8, w: 35, h: 40, label: "South Elevation" },
    { x: 20, y: 54, w: 60, h: 30, label: "Detail" },
  ],
  // Layout 3: Site plan
  [
    { x: 15, y: 10, w: 70, h: 75, label: "Site Plan" },
  ],
  // Layout 4: Details and sections
  [
    { x: 8, y: 10, w: 38, h: 35, label: "Detail 1" },
    { x: 52, y: 10, w: 38, h: 35, label: "Detail 2" },
    { x: 8, y: 50, w: 38, h: 35, label: "Detail 3" },
    { x: 52, y: 50, w: 38, h: 35, label: "Detail 4" },
  ],
  // Layout 5: 3D perspective
  [
    { x: 10, y: 15, w: 80, h: 65, label: "3D View" },
  ],
  // Layout 6: Construction details
  [
    { x: 12, y: 8, w: 32, h: 38, label: "Wall Section" },
    { x: 50, y: 8, w: 38, h: 28, label: "Foundation" },
    { x: 50, y: 42, w: 38, h: 38, label: "Roof Detail" },
  ],
];

function PageSketch({ pageNumber }: { pageNumber: number }) {
  const shapes = useMemo(() => layouts[pageNumber % layouts.length], [pageNumber]);

  return (
    <div className="page-sketch">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="page-box"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.w}%`,
            height: `${shape.h}%`,
          }}
        >
          {shape.label && (
            <span className="page-box-label">{shape.label}</span>
          )}
        </div>
      ))}
      <div className="page-number">{pageNumber + 1}</div>
    </div>
  );
}

// Component for rendering realistic page edges
function PageEdges({
  side,
  thickness,
  isAnimating
}: {
  side: 'left' | 'right';
  thickness: number;
  isAnimating: boolean;
}) {
  const renderLayers = () => {
    return Array.from({ length: thickness }).map((_, index) => {
      const offset = side === 'left'
        ? (thickness - index) * 0.7
        : index * 0.7;

      const brightness = 95 - (index * 1.5);
      const randomOffset = Math.sin(index * 2.3) * 0.15;

      return (
        <div
          key={index}
          className="page-edge-layer"
          style={{
            [side]: `${offset}px`,
            transform: `translateY(${randomOffset}px)`,
            opacity: 1 - (index * 0.025),
            background: `linear-gradient(180deg,
              hsl(38, 18%, ${brightness}%) 0%,
              hsl(36, 15%, ${brightness - 5}%) 100%)`,
            zIndex: side === 'left' ? thickness - index : index,
          }}
        />
      );
    });
  };

  return (
    <div
      className={`page-edges page-edges-${side} ${isAnimating ? 'animating' : ''}`}
      style={{ width: `${thickness * 0.7 + 5}px` }}
    >
      {renderLayers()}
      <div className="edge-shadow" />
    </div>
  );
}

export function Book() {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turning, setTurning] = useState<TurnDirection | null>(null);
  const [turnKey, setTurnKey] = useState(0);

  const totalSpreads = SPREAD_COUNT;
  const canNext = spreadIndex < totalSpreads - 1 && !turning;
  const canPrev = spreadIndex > 0 && !turning && isOpen;

  const leftPageNumber = spreadIndex * 2;
  const rightPageNumber = leftPageNumber + 1;

  // Calculate dynamic edge thickness
  const calculateEdgeThickness = useCallback(() => {
    const progress = spreadIndex / totalSpreads;
    const leftThickness = Math.floor(2 + (progress * 18)); // 2 to 20 layers
    const rightThickness = Math.floor(20 - (progress * 18)); // 20 to 2 layers

    return {
      left: Math.max(leftThickness, 2),
      right: Math.max(rightThickness, 2)
    };
  }, [spreadIndex, totalSpreads]);

  const edgeThickness = calculateEdgeThickness();

  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  const queueTurn = useCallback((dir: TurnDirection) => {
    if (turning) return;
    if (dir === "next" && !canNext) return;
    if (dir === "prev" && !canPrev) return;

    setTurning(dir);
    setTurnKey((k) => k + 1);

    setTimeout(() => {
      setSpreadIndex((idx) => {
        if (dir === "next") return Math.min(idx + 1, totalSpreads - 1);
        return Math.max(idx - 1, 0);
      });
    }, TURN_DURATION * 0.5);

    setTimeout(() => {
      setTurning(null);
    }, TURN_DURATION);
  }, [turning, canNext, canPrev, totalSpreads]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') queueTurn('next');
      if (e.key === 'ArrowLeft') queueTurn('prev');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, queueTurn]);

  return (
    <div className="book-shell">
      <div className="book-chrome">
        <button
          className="ghost-btn"
          onClick={() => queueTurn("prev")}
          disabled={!canPrev}
          aria-label="Previous spread"
        >
          ← Prev
        </button>
        <div className="book-meta">
          <span className="meta-pill">{isOpen ? "Architecture study" : "Tap cover to open"}</span>
          <span className="meta-pill">
            {spreadIndex + 1} / {totalSpreads}
          </span>
        </div>
        <button
          className="ghost-btn"
          onClick={() => {
            if (!isOpen) {
              handleOpen();
              return;
            }
            queueTurn("next");
          }}
          disabled={turning !== null || (isOpen && !canNext)}
          aria-label="Next spread"
        >
          Next →
        </button>
      </div>

      <div
        className="book-viewport"
        data-open={isOpen}
        onClick={() => {
          if (!isOpen) handleOpen();
        }}
      >
        <div className="book-frame">
          <div className="book-interior">
            {/* Left page edges */}
            {isOpen && (
              <PageEdges
                side="left"
                thickness={edgeThickness.left}
                isAnimating={turning !== null}
              />
            )}

            <div className="page page-left">
              <PageSketch pageNumber={leftPageNumber} />
            </div>
            <div className="page page-right">
              <PageSketch pageNumber={rightPageNumber} />
            </div>

            {/* Right page edges */}
            {isOpen && (
              <PageEdges
                side="right"
                thickness={edgeThickness.right}
                isAnimating={turning !== null}
              />
            )}

            <div className="book-crease" />
            <div className="book-bottom-crease" />
          </div>

          {!isOpen && (
            <div className="book-cover" role="button" aria-label="Open book">
              <div className="cover-title">
                <span className="cover-tag">Architecture</span>
                <span className="cover-name">blank gallery</span>
              </div>
            </div>
          )}

          {turning && (
            <div
              key={turnKey}
              className={`page-turner ${turning === "next" ? "turn-next" : "turn-prev"}`}
              style={{ ["--turn-duration" as any]: `${TURN_DURATION}ms` }}
              aria-hidden
            >
              {/* Front of the page (what you see before it flips) */}
              <div className="page-turner-front">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? rightPageNumber // Current right page turning left
                      : leftPageNumber - 1 // Previous left page turning back right
                  }
                />
              </div>
              {/* Back of the page (what you see after it flips) */}
              <div className="page-turner-back">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? rightPageNumber + 1 // Next page on the back
                      : leftPageNumber // Current left page becomes new right
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
