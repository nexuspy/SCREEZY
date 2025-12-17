import React from 'react';
import { Inbox, FileX, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon?: 'inbox' | 'file' | 'search' | React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const iconMap = {
    inbox: <Inbox className="w-12 h-12 text-gray-400" />,
    file: <FileX className="w-12 h-12 text-gray-400" />,
    search: <Search className="w-12 h-12 text-gray-400" />,
};

export function EmptyState({
    icon = 'inbox',
    title,
    description,
    action,
    className = '',
}: EmptyStateProps) {
    const iconElement = typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon;

    return (
        <div
            className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
            role="status"
            aria-label={title}
        >
            <div className="mb-4" aria-hidden="true">
                {iconElement}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-sm text-gray-600 max-w-md mb-6">{description}</p>}
            {action && (
                <Button onClick={action.onClick} aria-label={action.label}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
