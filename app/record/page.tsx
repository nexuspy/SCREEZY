'use client';

import { Recorder } from '@/components/features/recording/Recorder';
import { NoiseTexture } from '@/components/kinetic';

export default function RecordPage() {
    return (
        <>
            <NoiseTexture />
            <div className="min-h-screen py-12 px-4">
                <Recorder />
            </div>
        </>
    );
}
