import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    backButton?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    action,
    backButton,
    className = '',
}: PageHeaderProps) {
    return (
        <div className={`border-b bg-white ${className}`}>
            <div className="container mx-auto px-4 py-6">
                {backButton && <div className="mb-4">{backButton}</div>}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                        {description && <p className="mt-2 text-gray-600">{description}</p>}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            </div>
        </div>
    );
}
