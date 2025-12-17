'use client';

import { VideoTrimmer } from '@/components/features/trimming/VideoTrimmer';
import { NoiseTexture } from '@/components/kinetic';
import Link from 'next/link';

export default function TrimPage() {
    return (
        <>
            <NoiseTexture />
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <Link href="/" className="inline-block text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8">
                        ← BACK TO HOME
                    </Link>
                    <VideoTrimmer />
                </div>
            </div>
        </>
    );
}
