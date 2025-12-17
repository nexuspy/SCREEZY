import { NextRequest, NextResponse } from 'next/server';
import { videoDb, analyticsDb } from '@/lib/db';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('video') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No video file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('video/')) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload a video file.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save file
        const extension = file.name.split('.').pop() || 'webm';
        const filename = await storage.saveFile(buffer, extension);

        // Generate share token
        const shareToken = storage.generateShareToken();

        // Get file size
        const size = storage.getFileSize(filename);

        // Create database entry
        const videoId = videoDb.create({
            filename,
            originalFilename: file.name,
            shareToken,
            size,
        });

        // Initialize analytics
        analyticsDb.initForVideo(videoId as number);

        // Generate share URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const shareUrl = `${baseUrl}/watch/${shareToken}`;

        return NextResponse.json({
            success: true,
            videoId,
            shareToken,
            shareUrl,
            filename,
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload video. Please try again.' },
            { status: 500 }
        );
    }
}
