"use client";

import { useMemo, useState } from "react";

type TurnDirection = "next" | "prev";

const SPREAD_COUNT = 10;
const TURN_DURATION = 900; // ms

const layouts = [
  [
    { x: 6, y: 10, w: 42, h: 48 },
    { x: 54, y: 18, w: 32, h: 20 },
    { x: 54, y: 44, w: 26, h: 30 },
  ],
  [
    { x: 12, y: 16, w: 30, h: 34 },
    { x: 18, y: 56, w: 28, h: 28 },
    { x: 56, y: 18, w: 34, h: 58 },
  ],
  [
    { x: 10, y: 22, w: 64, h: 18 },
    { x: 10, y: 46, w: 36, h: 34 },
    { x: 52, y: 48, w: 30, h: 30 },
  ],
  [
    { x: 8, y: 18, w: 32, h: 56 },
    { x: 46, y: 20, w: 40, h: 22 },
    { x: 48, y: 48, w: 36, h: 30 },
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
        />
      ))}
      <div className="page-number">{pageNumber + 1}</div>
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

  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  const queueTurn = (dir: TurnDirection) => {
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
  };

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
            <div className="page page-left">
              <PageSketch pageNumber={leftPageNumber} />
            </div>
            <div className="page page-right">
              <PageSketch pageNumber={rightPageNumber} />
            </div>
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
              <PageSketch
                pageNumber={
                  turning === "next"
                    ? rightPageNumber
                    : Math.max((spreadIndex - 1) * 2 + 1, 0)
                }
              />
              <div className="page-turner-back" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
