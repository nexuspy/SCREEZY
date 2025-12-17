import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const { videoId: videoIdParam } = await params;
        const videoId = parseInt(videoIdParam);

        if (isNaN(videoId)) {
            return NextResponse.json(
                { error: 'Invalid video ID' },
                { status: 400 }
            );
        }

        const analytics = analyticsDb.get(videoId);

        if (!analytics) {
            return NextResponse.json(
                { error: 'Analytics not found' },
                { status: 404 }
            );
        }

        // Parse watch events
        const watchEvents = JSON.parse(analytics.watch_events || '[]');

        // Calculate average completion
        const avgCompletion = watchEvents.length > 0
            ? watchEvents.reduce((sum: number, event: any) => sum + event.percentage, 0) / watchEvents.length
            : 0;

        return NextResponse.json({
            videoId: analytics.video_id,
            views: analytics.views,
            watchEvents,
            avgCompletion: Math.round(avgCompletion * 100) / 100,
            lastViewed: analytics.last_viewed,
        });
    } catch (error) {
        console.error('Analytics get error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
