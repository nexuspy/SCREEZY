'use client';

// Noise texture overlay for kinetic typography aesthetic
// Creates subtle print/poster texture without affecting readability

export function NoiseTexture() {
    return (
        <svg
            className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay z-50"
            aria-hidden="true"
        >
            <filter id="noise">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.8"
                    numOctaves="4"
                    stitchTiles="stitch"
                />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    );
}
