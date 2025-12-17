'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface VideoPlayerProps {
    src: string;
    videoId: number;
    onViewTracked?: () => void;
}

export function VideoPlayer({ src, videoId, onViewTracked }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const lastProgressRef = useRef(0);

    // Track view on mount
    useEffect(() => {
        if (!hasTrackedView) {
            fetch('/api/analytics/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId }),
            })
                .then(() => {
                    setHasTrackedView(true);
                    onViewTracked?.();
                })
                .catch(console.error);
        }
    }, [videoId, hasTrackedView, onViewTracked]);

    // Track watch progress
    const trackProgress = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.duration === 0) return;

        const percentage = (video.currentTime / video.duration) * 100;

        // Track every 10% milestone
        const currentMilestone = Math.floor(percentage / 10) * 10;
        const lastMilestone = Math.floor(lastProgressRef.current / 10) * 10;

        if (currentMilestone > lastMilestone && currentMilestone >= 10) {
            fetch('/api/analytics/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId, percentage }),
            }).catch(console.error);
        }

        lastProgressRef.current = percentage;
    }, [videoId]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('timeupdate', trackProgress);
        return () => video.removeEventListener('timeupdate', trackProgress);
    }, [trackProgress]);

    return (
        <video
            ref={videoRef}
            src={src}
            controls
            className="w-full rounded-lg shadow-lg"
            preload="metadata"
        >
            Your browser does not support the video tag.
        </video>
    );
}
