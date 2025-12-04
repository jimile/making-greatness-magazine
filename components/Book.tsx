"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type TurnDirection = "next" | "prev";

// Array of optimized WebP image filenames
const DESIGN_IMAGES = [
  "(+81) GARBAGE POST (FINAL 1).webp",
  "(+81) GARBAGE POST (FINAL 2).webp",
  "(1) edit.webp",
  "(1)revised.webp",
  "(14).webp",
  "(16).webp",
  "(18).webp",
  "(2).webp",
  "(2)-2.webp",
  "(3).webp",
  "(4).webp",
  "(5).webp",
  "(6).webp",
  "(7) - EDGES.webp",
  "02E8BB51-8240-4A0B-8D3E-9F8E0FF9BD97.webp",
  "09D396B8-A6EF-45B9-891C-634252824EA7.webp",
  "1111.webp",
  "2025-03-18_135359_1.webp",
  "2025-04-23_145057.webp",
  "349CC09B-05F9-4144-A7F9-33F154BD3C56.webp",
  "377A0F70-2DBF-44BF-8718-A6438FA77EB5.webp",
  "3QM28THJAN.webp",
  "47A5A104-6236-4420-8EA4-74533A0C9AEE.webp",
  "60003D60-8FF3-4BC8-8066-DC2E7BC9A036.webp",
  "65FF1F41-87A7-49F3-96A1-9D8AD50F9EC2.webp",
  "6744CC2C-AAF0-4F4C-AE64-886C2D239616.webp",
  "678CA202-3B4F-44D7-A8D7-68BFC5792651.webp",
  "72762948-1092-4093-9C19-AA6DDD1DE994.webp",
  "A4(YELLOW)-2.webp",
  "Artboard 5.webp",
  "Artboard 7.webp",
  "Artboard 8.webp",
  "Artboard 9.webp",
  "AWNING TOUR (FINAL) - CREAM).webp",
  "awningedit(1).webp",
  "BALU(1) copy-2.webp",
  "BANDITS FT. OSCAR LANG.webp",
  "BANDITS-2.webp",
  "BLUE(FULLSIZE).webp",
  "BONHOMIE MAIN (FINAL)-1.webp",
  "BONHOMIE MAIN (FINAL)-2.webp",
  "BONHOMIE MAIN (FINAL)-6.webp",
  "BONHOMIE MAIN (FINAL)-8.webp",
  "BONHOMIE MAIN (FINAL)-9.webp",
  "CC3F7885-0CD5-4E94-91F0-7A14B51EC79C.webp",
  "CF8448FC-3008-4BF4-87B1-75FF9BD4BAA2.webp",
  "COLLAGE(FULLSIZE)UPDATED.webp",
  "CUTPRINT(1)-2.webp",
  "CUTPRINT(2)-2.webp",
  "D18F9739-371C-41CE-8280-B489AC10FFD0.webp",
  "D3B11819-7AD9-4985-BBDE-0D29259AB002.webp",
  "D4855C02-30A3-4206-B027-7268A88BBA48.webp",
  "D9B63ABE-012A-41B1-8040-3658E99F5139.webp",
  "F1100C50-3AC4-488A-8A68-24124C92286F.webp",
  "FD (EDIT).webp",
  "FD INSTA 4.webp",
  "FD INSTA 8.webp",
  "FD PRINT (1).webp",
  "FINAL_.webp",
  "FLUX(POSTER4).webp",
  "FLYING NUN RECORD STORE DAY (IDEA 2-2).webp",
  "GOBLIN A4 POSTER.webp",
  "HAND.webp",
  "Handwritten_2023-07-13_155950.webp",
  "HAPPY IDEA (11).webp",
  "HAPPY IDEA (7).webp",
  "HELMETMADE AD (3).webp",
  "HOP TOUR (13TH WLG)-1.webp",
  "IDEAPOSTERELI copy.webp",
  "IMG_8603.webp",
  "INDOOR - OUTDOOR.webp",
  "insta post 3.webp",
  "INSTA(2)-2.webp",
  "INSTA(3)-2.webp",
  "INSTA(SIZE)-2.webp",
  "INSTA.webp",
  "JB BAND POSTER (7).webp",
  "KEVIN EYES (1)-2.webp",
  "KEVIN EYES (2)-2.webp",
  "KEVIN EYES (3)-2.webp",
  "LOW STRUNG - UP LATE (FINAL).webp",
  "LOWSTRUNGFINAL(REVISED).webp",
  "LS (FINAL).webp",
  "merchdesign copy.webp",
  "MOLLY (NUMBER2BLACK).webp",
  "MOLLY _MAYBE_ FINAL (BLUE).webp",
  "MOLLY _MAYBE_ FINAL (PINK).webp",
  "MUSCLECAR IDEA - GREEN copy.webp",
  "MUSTANG(FINALPRINT2)-2.webp",
  "N&R(WELLIES B&W).webp",
  "N&R(WELLIESB&WCOLOUR).webp",
  "PARK RD AUS PRINT(1).webp",
  "Photo_2025-04-06_120830_1.webp",
  "Photo_2025-04-23_143631.webp",
  "Photo_2025-04-24_091448.webp",
  "PHOTOS(1)-2.webp",
  "PHOTOS(3)-2.webp",
  "PHOTOS(4) -2.webp",
  "PHOTOS(5)-2.webp",
  "POSTER (BORDERRREDO).webp",
  "POSTER IDEA (3)-2.webp",
  "POSTER IDEA (5)-2.webp",
  "POSTER IDEA (ELI-2).webp",
  "POSTER(NOBORDER)-2.webp",
  "POSTER(YELLOW) copy.webp",
  "POSTER-2.webp",
  "PRINT(1).webp",
  "PRINT(1)-2.webp",
  "PRINT(2).webp",
  "PRINT(4).webp",
  "PRINT(5).webp",
  "PRINT(6).webp",
  "PRINT(7TH).webp",
  "PRINT-2redo.webp",
  "PS (018-2).webp",
  "RABBIT.webp",
  "RECAP(5) copy-2.webp",
  "RED POSTER (3).webp",
  "RETURN OF EDEN BURNZ.webp",
  "RYAN(YELLOW).webp",
  "SALAD (1)-2.webp",
  "SALAD (3)-2.webp",
  "SALAD (4)-2.webp",
  "SALAD (EOM +GA) 2.webp",
  "SALT WATER CRIMINALS X AWNING @ GOBLIN.webp",
  "SLACKBARN MAIN POSTER - (IMAGE) - INSTAGRAM.webp",
  "STARGAZING X OPEN LATE (FINAL A4) ALT COLOUR.webp",
  "STARGAZING X OPEN LATE (FINAL A4).webp",
  "STINK (PICTURE FOR POST2)-2.webp",
  "STINK (PICTURE FOR POST2)-5.webp",
  "SWC GARBAGE INSTA (2).webp",
  "SWC GARBAGE INSTA (3)-2.webp",
  "SWC ORIGINAL COVER.webp",
  "SWC POST (2).webp",
  "SWC POST (3).webp",
  "SWC POST (4).webp",
  "SWC POST (5).webp",
  "SWC POST (6).webp",
  "SWC POST (7).webp",
  "SWC TOUR (WELLINGTON) - 2.webp",
  "SWC X MG (TOUR)-1.webp",
  "SWC X MG (TOUR)-5.webp",
  "SWC X MG (TOUR)-6.webp",
  "SWC X MG (TOUR)-7.webp",
  "TOGOEDIT(INSTA)-2.webp",
  "TOGOGARBAGE.webp",
  "WAX MUSTANG (FLUX 2ND JUNE) FINAL.webp",
  "WAX MUSTANG TOUR POSTER (1).webp",
  "WHITE POSTER (2).webp"
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
            src={`/images-optimized/${DESIGN_IMAGES[0]}`}
            alt="Book Cover"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 480px) 95vw, (max-width: 768px) 85vw, 45vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4wODY6OTI4MjQuNUFGRz5PN0hFVkZHSkpVT1L/2wBDARUXFyAeIBogHhogICAoSC4uLkhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
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
            src={`/images-optimized/${DESIGN_IMAGES[imageIndex]}`}
            alt={`Page ${pageNumber}`}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 480px) 95vw, (max-width: 768px) 85vw, 45vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4wODY6OTI4MjQuNUFGRz5PN0hFVkZHSkpVT1L/2wBDARUXFyAeIBogHhogICAoSC4uLkhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
          />
        </div>
      </div>
    );
  }

  // If we run out of images, show a blank page
  return (
    <div className="page-sketch">
      <div className="page-blank" />
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
  
  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const bookViewportRef = useRef<HTMLDivElement>(null);

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

    // Update state after animation completes, aligned with render cycle
    setTimeout(() => {
      requestAnimationFrame(() => {
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
      });
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

  // Touch/swipe handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  // Prevent scroll conflicts during horizontal swipe
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // If horizontal swipe detected, prevent scroll to avoid conflicts
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger swipe if horizontal movement is greater than vertical
    // and the swipe is at least 50px
    const minSwipeDistance = 50;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0 && canNext) {
        // Swipe left -> next page
        queueTurn('next');
      } else if (deltaX > 0 && canPrev) {
        // Swipe right -> previous page
        queueTurn('prev');
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [canNext, canPrev, queueTurn]);

  // Handle page click navigation
  const handlePageClick = useCallback((side: 'left' | 'right') => {
    if (turning) return;
    if (side === 'right' && canNext) {
      queueTurn('next');
    } else if (side === 'left' && canPrev) {
      queueTurn('prev');
    }
  }, [turning, canNext, canPrev, queueTurn]);

  // Handle closed book click to open
  const handleClosedBookClick = useCallback(() => {
    if (!isOpen && canNext && !turning) {
      queueTurn('next');
    }
  }, [isOpen, canNext, turning, queueTurn]);

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
      <div
        className="book-viewport"
        data-open={isOpen}
        ref={bookViewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={!isOpen ? handleClosedBookClick : undefined}
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
                <div 
                  className="page page-left page-clickable"
                  onClick={() => handlePageClick('left')}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous page"
                >
                  <PageSketch pageNumber={
                    turning === "prev" ? leftPageNumber - 2 : leftPageNumber
                  } />
                </div>
                <div 
                  className="page page-right page-clickable"
                  onClick={() => handlePageClick('right')}
                  role="button"
                  tabIndex={0}
                  aria-label="Next page"
                >
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

      {/* Navigation buttons below the book */}
      <div className="book-controls">
        <button
          className="ghost-btn"
          onClick={() => queueTurn("prev")}
          disabled={!canPrev}
          aria-label="Previous spread"
        >
          ← Prev
        </button>
        <div className="page-indicator">
          {isOpen ? `${Math.max(1, spreadIndex * 2 + 1)}-${Math.min(TOTAL_PAGES, spreadIndex * 2 + 2)} / ${TOTAL_PAGES}` : ''}
        </div>
        <button
          className="ghost-btn"
          onClick={() => queueTurn("next")}
          disabled={!canNext}
          aria-label="Next spread"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
