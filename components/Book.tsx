"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

type TurnDirection = "next" | "prev";

const SPREAD_COUNT = 12; // 12 spreads = 24 pages total
const TURN_DURATION = 1100; // ms - increased for smoother animation
const TOTAL_PAGES = SPREAD_COUNT * 2;
const BASE_STACK_PAGES = 80; // Permanent pages that always stay on the right
const VISIBLE_STACK_LAYERS = 150; // Total visible pages for realistic book thickness
const CLOSED_STACK_LAYERS = VISIBLE_STACK_LAYERS;

function PageSketch({ pageNumber }: { pageNumber: number }) {
  // Ensure pageNumber is always valid and non-negative
  const safePageNumber = Math.max(0, pageNumber);

  return (
    <div className="page-sketch">
      <div className="page-number">{safePageNumber + 1}</div>
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
  // Right side: base pages + remaining readable pages
  const remainingReadablePages = Math.max(0, TOTAL_PAGES - spreadIndex * 2);
  const remainingClosedLayers = BASE_STACK_PAGES + remainingReadablePages;
  // Left side: only transferred readable pages (gradually builds up)
  const turnedLayers = Math.min(spreadIndex * 2, TOTAL_PAGES);

  const totalSpreads = SPREAD_COUNT;
  const canNext = spreadIndex < totalSpreads - 1 && !turning;
  const canPrev = spreadIndex > 0 && !turning && isOpen;

  const leftPageNumber = spreadIndex * 2;
  const rightPageNumber = leftPageNumber + 1;
  const coverAnimationDuration = TURN_DURATION;

  // Calculate dynamic edge thickness
  const calculateEdgeThickness = useCallback(() => {
    // Don't update thickness while turning to prevent shifts
    const actualIndex = turning ?
      (turning === 'next' ? spreadIndex : spreadIndex) :
      spreadIndex;

    const progress = actualIndex / totalSpreads;
    const leftThickness = Math.floor(2 + (progress * 28)); // 2 to 30 layers
    const rightThickness = Math.floor(30 - (progress * 28)); // 30 to 2 layers

    return {
      left: Math.max(leftThickness, 2),
      right: Math.max(rightThickness, 2)
    };
  }, [spreadIndex, totalSpreads, turning]);

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

    // Update everything after animation completes
    setTimeout(() => {
      setSpreadIndex((idx) => {
        if (dir === "next") return Math.min(idx + 1, totalSpreads - 1);
        return Math.max(idx - 1, 0);
      });
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

  const renderClosedPages = useCallback((count: number, side: 'left' | 'right' = 'right') => {
    // Use smaller offset for many pages to prevent excessive width
    const offsetStep = count > 100 ? 1.0 : 1.3;
    const baseDepth = 30;
    // Render all requested pages for realistic thickness
    const maxRenderLayers = Math.min(count, 150);
    return Array.from({ length: maxRenderLayers }).map((_, layer) => {
      // Progressive darkening and opacity for depth effect
      const opacity = layer > 60 ? Math.max(0.4, 1 - (layer - 60) * 0.006) : 1;
      const brightness = layer > 40 ? Math.max(0.7, 1 - (layer - 40) * 0.003) : 1;

      return (
        <div
          key={`${side}-${layer}`}
          className={`book-closed-pages book-closed-pages-${side}`}
          aria-hidden
          style={{
            ["--page-offset" as any]: `${layer * offsetStep}px`,
            ["--page-depth" as any]: `${baseDepth + count - layer}`,
            opacity,
            filter: `brightness(${brightness})`,
          }}
        />
      );
    });
  }, []);

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
          {isOpen && remainingClosedLayers > 0 && (
            <div className="book-stack" data-side="right" aria-hidden>
              {renderClosedPages(remainingClosedLayers, 'right')}
            </div>
          )}
          {isOpen && turnedLayers > 0 && (
            <div className="book-stack" data-side="left" aria-hidden>
              {renderClosedPages(turnedLayers, 'left')}
            </div>
          )}
          <div className="book-interior">
            {/* Left page edges */}
            {isOpen && (
              <PageEdges
                side="left"
                thickness={edgeThickness.left}
                isAnimating={false} // Left edges should never animate
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
                isAnimating={turning === 'next'} // Only animate when turning next
              />
            )}

            <div className="book-crease" />
            <div className="book-bottom-crease" />
          </div>

          {!isOpen && (
            <>
              {renderClosedPages(VISIBLE_STACK_LAYERS, 'right')}
              <div
                className="book-cover"
                role="button"
                aria-label="Open book"
                style={{ ["--turn-duration" as any]: `${coverAnimationDuration}ms` }}
              >
                <div className="cover-layout">
                  <div className="cover-top">
                    <div className="cover-image-card">
                      <div className="cover-heat-blob" />
                      <div className="cover-heat-outline" />
                    </div>
                    <span className="cover-author">Architectural Drawings</span>
                  </div>
                  <div className="cover-title-block">
                    <span className="cover-title">
                      Design
                      <br />
                      Portfolio
                    </span>
                  </div>
                  <div className="cover-footer">
                    <span>2024 Collection</span>
                    <span>Volume 1</span>
                  </div>
                </div>
              </div>
            </>
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
                      : Math.max(0, leftPageNumber - 1) // Previous left page turning back right
                  }
                />
              </div>
              {/* Back of the page (what you see after it flips) */}
              <div className="page-turner-back">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? rightPageNumber + 1 // Next left page
                      : leftPageNumber - 1 // Previous right page
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
