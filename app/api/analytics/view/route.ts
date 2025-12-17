import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        analyticsDb.incrementView(videoId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics view error:', error);
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        );
    }
}
