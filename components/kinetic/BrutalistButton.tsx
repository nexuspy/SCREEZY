'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
}

// Brutalist button: uppercase, sharp corners, dramatic scale on hover
export const BrutalistButton = forwardRef<HTMLButtonElement, BrutalistButtonProps>(
    ({ variant = 'primary', size = 'default', className, children, ...props }, ref) => {
        const baseStyles = 'uppercase tracking-tighter font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-accent text-accent-foreground hover:scale-105 border-2 border-accent',
            outline: 'bg-transparent text-foreground border-2 border-border hover:bg-foreground hover:text-background',
            ghost: 'bg-transparent text-foreground hover:text-accent border-none',
        };

        const sizes = {
            sm: 'h-10 px-4 text-sm',
            default: 'h-14 px-8 text-base',
            lg: 'h-20 px-12 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

BrutalistButton.displayName = 'BrutalistButton';
