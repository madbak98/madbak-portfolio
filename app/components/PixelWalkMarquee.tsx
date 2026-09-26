"use client";

import "./pixel-walk-marquee.css";

/**
 * Decorative pixel-art MADBAK walker — transition strip between About and Works.
 * CSS-only sprite cycle + horizontal walk. No Pet / dialogue coupling.
 */
export function PixelWalkMarquee() {
  return (
    <section
      className="pixel-walk-marquee"
      aria-hidden="true"
      data-section="pixel-walk"
    >
      <div className="pixel-walk-marquee__viewport">
        <div className="pixel-walk-marquee__walker">
          <div className="pixel-walk-marquee__sprite" />
        </div>
      </div>
    </section>
  );
}
