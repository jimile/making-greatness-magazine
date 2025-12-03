"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

type TurnDirection = "next" | "prev";

const SPREAD_COUNT = 25; // 25 spreads = 50 pages total
const TURN_DURATION = 1100; // ms - increased for smoother animation
const TOTAL_PAGES = SPREAD_COUNT * 2;
const BASE_STACK_PAGES = 0; // No permanent pages - all pages can be turned
const VISIBLE_STACK_LAYERS = 50; // Match the actual page count for realism
const CLOSED_STACK_LAYERS = VISIBLE_STACK_LAYERS;

function PageSketch({ pageNumber }: { pageNumber: number }) {
  // Page 0 is the cover - simple orange page
  if (pageNumber === 0) {
    return <div className="page-cover-simple" />;
  }

  // Negative page numbers represent the back of the cover (blank)
  if (pageNumber < 0) {
    return <div className="page-blank" />;
  }

  // Regular pages start from 1
  return (
    <div className="page-sketch">
      <div className="page-number">{pageNumber}</div>
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
  // Start with spreadIndex = -1 for closed book
  const [spreadIndex, setSpreadIndex] = useState(-1);
  const [turning, setTurning] = useState<TurnDirection | null>(null);
  const [turnKey, setTurnKey] = useState(0);

  // Book is open when spreadIndex is 0 or greater
  const isOpen = spreadIndex >= 0;

  // Calculate page stacks for realistic thickness
  // When closed (spreadIndex = -1), all pages are on the right
  // As we turn pages, they move to the left side
  const actualSpreadIndex = Math.max(0, spreadIndex);
  const remainingReadablePages = Math.max(0, TOTAL_PAGES - actualSpreadIndex * 2);
  // Keep at least 2 pages on the right for the back cover
  const remainingClosedLayers = Math.max(2, BASE_STACK_PAGES + remainingReadablePages);
  const turnedLayers = Math.min(actualSpreadIndex * 2, TOTAL_PAGES);

  const totalSpreads = SPREAD_COUNT;
  // Can go next if not at the last spread
  const canNext = spreadIndex < totalSpreads - 1 && !turning;
  // Can go prev if the book is open (spreadIndex >= 0)
  const canPrev = spreadIndex >= 0 && !turning;

  // Page numbering:
  // When spreadIndex = -1: book is closed (shows orange cover)
  // When spreadIndex = 0: left page = 1, right page = 2 (first content pages)
  // When spreadIndex = 1: left page = 3, right page = 4, etc.
  const leftPageNumber = spreadIndex < 0 ? -1 : (spreadIndex * 2) + 1;
  const rightPageNumber = spreadIndex < 0 ? 0 : leftPageNumber + 1;
  const coverAnimationDuration = TURN_DURATION;

  // Calculate dynamic edge thickness
  const calculateEdgeThickness = useCallback(() => {
    // Don't update thickness while turning to prevent shifts
    const actualIndex = turning ?
      (turning === 'next' ? actualSpreadIndex : actualSpreadIndex) :
      actualSpreadIndex;

    const progress = actualIndex / totalSpreads;
    const leftThickness = Math.floor(2 + (progress * 48)); // 2 to 50 layers for realistic thickness
    const rightThickness = Math.floor(50 - (progress * 48)); // 50 to 2 layers for realistic thickness

    return {
      left: Math.max(leftThickness, 2),
      right: Math.max(rightThickness, 2)
    };
  }, [actualSpreadIndex, totalSpreads, turning]);

  const edgeThickness = calculateEdgeThickness();

  const queueTurn = useCallback((dir: TurnDirection) => {
    if (turning) return;
    if (dir === "next" && !canNext) return;
    if (dir === "prev" && !canPrev) return;

    setTurning(dir);
    setTurnKey((k) => k + 1);

    // Update everything after animation completes
    setTimeout(() => {
      setSpreadIndex((idx) => {
        if (dir === "next") {
          // Moving forward: from -1 (closed) to 0 (cover open), or to next spreads
          return Math.min(idx + 1, totalSpreads - 1);
        } else {
          // Moving backward: can go back to -1 (close the book)
          return Math.max(idx - 1, -1);
        }
      });
      setTurning(null);
    }, TURN_DURATION);
  }, [turning, canNext, canPrev, totalSpreads]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && canNext) queueTurn('next');
      if (e.key === 'ArrowLeft' && canPrev) queueTurn('prev');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canNext, canPrev, queueTurn]);

  const renderClosedPages = useCallback((count: number, side: 'left' | 'right' = 'right') => {
    // Use smaller offset for many pages to prevent excessive width
    const offsetStep = count > 30 ? 1.0 : 1.3;
    const baseDepth = 30;
    // Render only the actual pages for realistic thickness
    const maxRenderLayers = Math.min(count, 50);
    return Array.from({ length: maxRenderLayers }).map((_, layer) => {
      // Progressive darkening and opacity for depth effect
      const opacity = layer > 25 ? Math.max(0.4, 1 - (layer - 25) * 0.015) : 1;
      const brightness = layer > 15 ? Math.max(0.7, 1 - (layer - 15) * 0.008) : 1;

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
          onClick={() => queueTurn("next")}
          disabled={!canNext}
          aria-label="Next spread"
        >
          Next →
        </button>
      </div>

      <div
        className="book-viewport"
        data-open={isOpen}
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

            {/* Only show pages when book is open */}
            {isOpen && (
              <>
                <div className="page page-left">
                  <PageSketch pageNumber={leftPageNumber} />
                </div>
                <div className="page page-right">
                  <PageSketch pageNumber={rightPageNumber} />
                </div>
              </>
            )}

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

          {/* Show closed book with orange cover as the front page */}
          {!isOpen && (
            <>
              {renderClosedPages(VISIBLE_STACK_LAYERS, 'right')}
              <div className="book-cover-closed" />
            </>
          )}

          {turning && (
            <div
              key={turnKey}
              className={`page-turner ${turning === "next" ? "turn-next" : "turn-prev"} ${spreadIndex === -1 && turning === "next" ? "cover-opening" : ""} ${spreadIndex === 0 && turning === "prev" ? "cover-closing" : ""}`}
              style={{ ["--turn-duration" as any]: `${TURN_DURATION}ms` }}
              aria-hidden
            >
              {/* Front of the page (what you see before it flips) */}
              <div className="page-turner-front">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? (spreadIndex === -1 ? 0 : rightPageNumber) // Orange cover or current right page
                      : (spreadIndex === 0 ? 1 : leftPageNumber - 2) // First content page going back to cover
                  }
                />
              </div>
              {/* Back of the page (what you see after it flips) */}
              <div className="page-turner-back">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? (spreadIndex === -1 ? 1 : rightPageNumber + 1) // First content page or next left page
                      : (spreadIndex === 0 ? 0 : rightPageNumber - 2) // Orange cover (when closing) or previous right page
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
