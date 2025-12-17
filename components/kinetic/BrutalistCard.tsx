'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BrutalistCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    enableHover?: boolean;  // Enable color inversion on hover
}

// Brutalist card: sharp corners, color flood on hover
export function BrutalistCard({
    children,
    enableHover = true,
    className,
    ...props
}: BrutalistCardProps) {
    return (
        <div
            className={cn(
                'border-2 border-border bg-background p-12 group',
                enableHover && 'transition-all duration-300 hover:bg-accent hover:border-accent',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Text component that inverts color when parent card is hovered
export function BrutalistCardTitle({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                'text-3xl font-bold uppercase tracking-tighter leading-none text-foreground transition-colors duration-300',
                'group-hover:text-accent-foreground',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

export function BrutalistCardDescription({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                'text-lg text-muted-foreground transition-colors duration-300',
                'group-hover:text-accent-foreground/80',
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
}
