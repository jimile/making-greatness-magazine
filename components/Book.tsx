"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";

type TurnDirection = "next" | "prev";

// Array of all image filenames from the design archive
const DESIGN_IMAGES = [
  "(+81) GARBAGE POST (FINAL 1).PNG",
  "(+81) GARBAGE POST (FINAL 2).PNG",
  "(1) edit.JPG",
  "(1)revised.JPEG",
  "(14).JPG",
  "(16).JPG",
  "(18).JPG",
  "(2).JPG",
  "(2)-2.JPG",
  "(3).JPG",
  "(4).JPEG",
  "(4).JPG",
  "(4).PNG",
  "(5).JPEG",
  "(5).JPG",
  "(6).JPG",
  "(7) - EDGES.JPG",
  "02E8BB51-8240-4A0B-8D3E-9F8E0FF9BD97.JPG",
  "09D396B8-A6EF-45B9-891C-634252824EA7.JPG",
  "1111.JPG",
  "2025-03-18_135359_1.JPG",
  "2025-04-23_145057.JPG",
  "349CC09B-05F9-4144-A7F9-33F154BD3C56.JPG",
  "377A0F70-2DBF-44BF-8718-A6438FA77EB5.JPG",
  "3QM28THJAN.JPG",
  "47A5A104-6236-4420-8EA4-74533A0C9AEE.JPG",
  "60003D60-8FF3-4BC8-8066-DC2E7BC9A036.JPG",
  "65FF1F41-87A7-49F3-96A1-9D8AD50F9EC2.JPG",
  "6744CC2C-AAF0-4F4C-AE64-886C2D239616.JPG",
  "678CA202-3B4F-44D7-A8D7-68BFC5792651.JPG",
  "72762948-1092-4093-9C19-AA6DDD1DE994.JPG",
  "A4(YELLOW)-2.JPG",
  "Artboard 5.JPG",
  "Artboard 7.JPG",
  "Artboard 8.JPG",
  "Artboard 9.JPG",
  "AWNING TOUR (FINAL) - CREAM).jpg",
  "awningedit(1).JPG",
  "BALU(1) copy-2.JPG",
  "BANDITS FT. OSCAR LANG.JPG",
  "BANDITS-2.JPG",
  "BLUE(FULLSIZE).JPG",
  "BONHOMIE MAIN (FINAL)-1.JPG",
  "BONHOMIE MAIN (FINAL)-2.JPG",
  "BONHOMIE MAIN (FINAL)-6.JPG",
  "BONHOMIE MAIN (FINAL)-8.JPG",
  "BONHOMIE MAIN (FINAL)-9.JPG",
  "CC3F7885-0CD5-4E94-91F0-7A14B51EC79C.JPG",
  "CF8448FC-3008-4BF4-87B1-75FF9BD4BAA2.JPG",
  "COLLAGE(FULLSIZE)UPDATED.JPG",
  "CUTPRINT(1)-2.JPG",
  "CUTPRINT(2)-2.JPG",
  "D18F9739-371C-41CE-8280-B489AC10FFD0.JPG",
  "D3B11819-7AD9-4985-BBDE-0D29259AB002.JPG",
  "D4855C02-30A3-4206-B027-7268A88BBA48.JPG",
  "D9B63ABE-012A-41B1-8040-3658E99F5139.JPG",
  "F1100C50-3AC4-488A-8A68-24124C92286F.JPG",
  "FD (EDIT).JPG",
  "FD INSTA 4.JPG",
  "FD INSTA 8.JPG",
  "FD PRINT (1).JPG",
  "FINAL_.JPG",
  "FLUX(POSTER4).JPG",
  "FLYING NUN RECORD STORE DAY (IDEA 2-2).JPG",
  "GOBLIN A4 POSTER.jpg",
  "HAND.JPG",
  "Handwritten_2023-07-13_155950.JPG",
  "HAPPY IDEA (11).PNG",
  "HAPPY IDEA (7).PNG",
  "HELMETMADE AD (3).JPG",
  "HOP TOUR (13TH WLG)-1.JPG",
  "IDEAPOSTERELI copy.JPEG",
  "IMG_8603.jpg",
  "INDOOR - OUTDOOR.JPEG",
  "insta post 3.JPG",
  "INSTA(2)-2.JPG",
  "INSTA(3)-2.JPG",
  "INSTA(SIZE)-2.JPG",
  "INSTA.PNG",
  "JB BAND POSTER (7).JPG",
  "KEVIN EYES (1)-2.JPG",
  "KEVIN EYES (2)-2.JPG",
  "KEVIN EYES (3)-2.JPG",
  "LOW STRUNG - UP LATE (FINAL).JPG",
  "LOWSTRUNGFINAL(REVISED).JPEG",
  "LS (FINAL).JPG",
  "merchdesign copy.JPG",
  "MOLLY (NUMBER2BLACK).PNG",
  "MOLLY _MAYBE_ FINAL (BLUE).PNG",
  "MOLLY _MAYBE_ FINAL (PINK).PNG",
  "MUSCLECAR IDEA - GREEN copy.JPG",
  "MUSTANG(FINALPRINT2)-2.JPG",
  "N&R(WELLIES B&W).JPG",
  "N&R(WELLIESB&WCOLOUR).JPG",
  "PARK RD AUS PRINT(1).PNG",
  "Photo_2025-04-06_120830_1.JPG",
  "Photo_2025-04-23_143631.JPG",
  "Photo_2025-04-24_091448.JPG",
  "PHOTOS(1)-2.JPG",
  "PHOTOS(3)-2.JPG",
  "PHOTOS(4) -2.JPG",
  "PHOTOS(5)-2.JPG",
  "POSTER (BORDERRREDO).JPG",
  "POSTER IDEA (3)-2.JPG",
  "POSTER IDEA (5)-2.JPG",
  "POSTER IDEA (ELI-2).JPG",
  "POSTER(NOBORDER)-2.JPG",
  "POSTER(YELLOW) copy.JPG",
  "POSTER-2.JPG",
  "PRINT(1).JPG",
  "PRINT(1)-2.JPG",
  "PRINT(2).JPG",
  "PRINT(4).JPG",
  "PRINT(5).JPG",
  "PRINT(6).JPG",
  "PRINT(7TH).JPG",
  "PRINT-2redo.JPG",
  "PS (018-2).JPG",
  "RABBIT.JPG",
  "RECAP(5) copy-2.JPG",
  "RED POSTER (3).JPG",
  "RETURN OF EDEN BURNZ.JPG",
  "RYAN(YELLOW).JPG",
  "SALAD (1)-2.JPG",
  "SALAD (3)-2.JPG",
  "SALAD (4)-2.JPG",
  "SALAD (EOM +GA) 2.JPG",
  "SALT WATER CRIMINALS X AWNING @ GOBLIN.jpg",
  "SLACKBARN MAIN POSTER - (IMAGE) - INSTAGRAM.jpg",
  "STARGAZING X OPEN LATE (FINAL A4) ALT COLOUR.PNG",
  "STARGAZING X OPEN LATE (FINAL A4).PNG",
  "STINK (PICTURE FOR POST2)-2.JPG",
  "STINK (PICTURE FOR POST2)-5.JPG",
  "SWC GARBAGE INSTA (2).JPG",
  "SWC GARBAGE INSTA (3)-2.JPG",
  "SWC ORIGINAL COVER.JPG",
  "SWC POST (2).JPG",
  "SWC POST (3).JPG",
  "SWC POST (4).JPG",
  "SWC POST (5).JPG",
  "SWC POST (6).JPG",
  "SWC POST (7).JPG",
  "SWC TOUR (WELLINGTON) - 2.JPG",
  "SWC X MG (TOUR)-1.JPG",
  "SWC X MG (TOUR)-5.JPG",
  "SWC X MG (TOUR)-6.JPG",
  "SWC X MG (TOUR)-7.JPG",
  "TOGOEDIT(INSTA)-2.JPG",
  "TOGOGARBAGE.JPG",
  "WAX MUSTANG (FLUX 2ND JUNE) FINAL.PNG",
  "WAX MUSTANG TOUR POSTER (1).JPG",
  "WHITE POSTER (2).JPG"
];

// Calculate spread count based on available images (each spread has 2 pages)
const SPREAD_COUNT = Math.ceil(DESIGN_IMAGES.length / 2);
const TURN_DURATION = 600; // ms - faster page turn animation
const TOTAL_PAGES = SPREAD_COUNT * 2;
const BASE_STACK_PAGES = 0; // No permanent pages - all pages can be turned
const VISIBLE_STACK_LAYERS = 50; // Match the actual page count for realism
const CLOSED_STACK_LAYERS = VISIBLE_STACK_LAYERS;

function PageSketch({ pageNumber }: { pageNumber: number }) {
  // Page 0 is the cover - use the first image as cover
  if (pageNumber === 0) {
    return (
      <div className="page-cover-simple">
        <div className="page-image-container">
          <Image
            src={`/DESIGN ARCHIVE FOR WEBSITE-20251126T045719Z-1-001/${DESIGN_IMAGES[0]}`}
            alt="Book Cover"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    );
  }

  // Negative page numbers represent the back of the cover (blank)
  if (pageNumber < 0) {
    return <div className="page-blank" />;
  }

  // Regular pages start from 1
  // Map page number to image index (page 1 = image index 0 or 1 depending on if we used one for cover)
  const imageIndex = pageNumber; // Since we use image 0 for cover, page 1 gets image 1, etc.

  // Check if we have an image for this page
  if (imageIndex < DESIGN_IMAGES.length) {
    return (
      <div className="page-sketch">
        <div className="page-image-container">
          <Image
            src={`/DESIGN ARCHIVE FOR WEBSITE-20251126T045719Z-1-001/${DESIGN_IMAGES[imageIndex]}`}
            alt={`Page ${pageNumber}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="page-number">{pageNumber}</div>
      </div>
    );
  }

  // If we run out of images, show a blank page
  return (
    <div className="page-sketch">
      <div className="page-blank" />
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
                  <PageSketch pageNumber={
                    turning === "prev" ? leftPageNumber - 2 : leftPageNumber
                  } />
                </div>
                <div className="page page-right">
                  <PageSketch pageNumber={
                    turning === "next" ? rightPageNumber + 2 : rightPageNumber
                  } />
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
              style={{ ["--turn-duration" as string]: `${TURN_DURATION}ms` }}
              aria-hidden
            >
              {/* Front of the page */}
              <div className="page-turner-front">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? (spreadIndex === -1 ? 0 : rightPageNumber)
                      : leftPageNumber
                  }
                />
              </div>
              {/* Back of the page - shows next page content */}
              <div className="page-turner-back">
                <PageSketch
                  pageNumber={
                    turning === "next"
                      ? (spreadIndex === -1 ? 1 : leftPageNumber + 2)
                      : (spreadIndex === 0 ? 0 : leftPageNumber - 1)
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
