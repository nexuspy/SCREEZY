// Design tokens for kinetic typography system
export const colors = {
    background: '#09090B',        // Rich black (not pure black)
    foreground: '#FAFAFA',         // Off-white (not pure white)
    muted: '#27272A',              // Dark gray (zinc-800)
    mutedForeground: '#A1A1AA',    // Zinc-400
    accent: '#DFE104',             // Acid yellow (high energy)
    accentForeground: '#000000',   // Pure black
    border: '#3F3F46',             // Zinc-700
} as const;

export const typography = {
    // Fluid viewport-based scaling using clamp
    hero: 'text-[clamp(3rem,12vw,14rem)]',
    sectionHeading: 'text-5xl md:text-7xl lg:text-8xl',
    cardTitle: 'text-2xl md:text-3xl lg:text-6xl',
    massiveNumber: 'text-[8rem] md:text-[12rem]',
    body: 'text-lg md:text-xl lg:text-2xl',
    label: 'text-xs md:text-sm lg:text-lg',
} as const;

export const spacing = {
    section: 'py-32',        // 128px vertical
    card: 'p-12',            // 48px all sides
    elementGap: 'gap-8',     // 32px between elements
    tightGap: 'gap-4',       // 16px tight spacing
} as const;

export const animation = {
    marqueefast: 80,         // Fast scroll speed
    marqueeSlow: 40,         // Slow scroll speed
    hoverDuration: 300,      // Hover transition ms
    scaleDuration: 200,      // Button scale ms
} as const;
