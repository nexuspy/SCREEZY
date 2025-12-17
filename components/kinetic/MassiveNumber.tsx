'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MassiveNumberProps extends HTMLAttributes<HTMLDivElement> {
    children: string | number;
    decorative?: boolean;  // If true, uses muted color and absolute positioning
}

// Massive decorative numbers (8rem-12rem)
// Used as background graphic elements
export function MassiveNumber({
    children,
    decorative = false,
    className,
    ...props
}: MassiveNumberProps) {
    return (
        <div
            className={cn(
                'font-bold leading-none',
                decorative
                    ? 'text-[8rem] md:text-[12rem] text-muted absolute -z-10 select-none pointer-events-none'
                    : 'text-[6rem] md:text-[8rem] text-foreground',
                className
            )}
            aria-hidden={decorative}
            {...props}
        >
            {children}
        </div>
    );
}
