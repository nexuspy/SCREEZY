'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BrutalistInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

// Oversized input with bottom border only
// Dramatic scale (h-24, text-4xl)
export function BrutalistInput({
    value,
    onChange,
    placeholder,
    className,
    ...props
}: BrutalistInputProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={cn(
                'w-full h-24 px-0 bg-transparent',
                'border-0 border-b-2 border-border',
                'text-4xl font-bold uppercase tracking-tighter',
                'text-foreground placeholder:text-muted',
                'focus:outline-none focus:border-accent',
                'transition-colors duration-200',
                className
            )}
            {...props}
        />
    );
}
