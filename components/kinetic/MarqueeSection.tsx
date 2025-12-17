'use client';

import Marquee from 'react-fast-marquee';
import { ReactNode } from 'react';

interface MarqueeSectionProps {
    children: ReactNode;
    speed?: number;  // 40 (slow) or 80 (fast)
    direction?: 'left' | 'right';
    className?: string;
    background?: 'default' | 'accent';  // Background color variant
}

// Infinite scrolling marquee section
// No gradients - raw edge for brutalist aesthetic
export function MarqueeSection({
    children,
    speed = 80,
    direction = 'left',
    className = '',
    background = 'default'
}: MarqueeSectionProps) {
    const bgStyles = background === 'accent'
        ? 'bg-accent text-accent-foreground'
        : 'bg-background text-foreground';

    return (
        <div className={`py-8 overflow-hidden ${bgStyles} ${className}`}>
            <Marquee
                speed={speed}
                gradient={false}  // No gradient - hard edges
                autoFill
                direction={direction}
            >
                {children}
            </Marquee>
        </div>
    );
}

// Item to display inside marquee with spacing
export function MarqueeItem({ children }: { children: ReactNode }) {
    return (
        <div className="mx-8 flex items-center gap-4">
            {children}
        </div>
    );
}
