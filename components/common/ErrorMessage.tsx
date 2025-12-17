import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
    title?: string;
    message: string;
    variant?: 'error' | 'warning';
    className?: string;
    onDismiss?: () => void;
}

const variantStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconVariants = {
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
};

export function ErrorMessage({
    title = 'Error',
    message,
    variant = 'error',
    className = '',
    onDismiss,
}: ErrorMessageProps) {
    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
                {iconVariants[variant]}
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm mt-1">{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Dismiss error message"
                >
                    <XCircle className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
