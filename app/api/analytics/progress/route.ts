import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { videoId, percentage } = await request.json();

        if (!videoId || percentage === undefined) {
            return NextResponse.json(
                { error: 'Video ID and percentage are required' },
                { status: 400 }
            );
        }

        analyticsDb.addWatchEvent(videoId, percentage);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics progress error:', error);
        return NextResponse.json(
            { error: 'Failed to track progress' },
            { status: 500 }
        );
    }
}
