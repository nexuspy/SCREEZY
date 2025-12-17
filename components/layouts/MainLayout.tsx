import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
}

export function MainLayout({
    children,
    header,
    footer,
    sidebar,
    className = '',
}: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            {header && <header className="sticky top-0 z-50">{header}</header>}

            <div className="flex flex-1">
                {sidebar && (
                    <aside className="hidden lg:block w-64 border-r bg-gray-50">
                        {sidebar}
                    </aside>
                )}

                <main className={`flex-1 ${className}`}>
                    {children}
                </main>
            </div>

            {footer && <footer className="border-t bg-gray-50">{footer}</footer>}
        </div>
    );
}
