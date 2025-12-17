'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

export const ffmpegUtils = {
    /**
     * Load FFmpeg.wasm
     */
    load: async (onProgress?: (progress: number) => void): Promise<FFmpeg> => {
        if (ffmpegInstance && isLoaded) {
            return ffmpegInstance;
        }

        ffmpegInstance = new FFmpeg();

        // Set up logging
        ffmpegInstance.on('log', ({ message }) => {
            console.log('[FFmpeg]', message);
        });

        // Set up progress tracking
        if (onProgress) {
            ffmpegInstance.on('progress', ({ progress }) => {
                onProgress(Math.round(progress * 100));
            });
        }

        // Load FFmpeg
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpegInstance.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        isLoaded = true;
        return ffmpegInstance;
    },

    /**
     * Trim video
     * @param videoBlob - Input video blob
     * @param startTime - Start time in seconds
     * @param endTime - End time in seconds
     * @param outputFormat - Output format (webm or mp4)
     * @returns Trimmed video blob
     */
    trimVideo: async (
        videoBlob: Blob,
        startTime: number,
        endTime: number,
        outputFormat: 'webm' | 'mp4' = 'webm'
    ): Promise<Blob> => {
        const ffmpeg = await ffmpegUtils.load();

        // Write input file
        const inputName = 'input.webm';
        const outputName = `output.${outputFormat}`;

        await ffmpeg.writeFile(inputName, await fetchFile(videoBlob));

        // Calculate duration
        const duration = endTime - startTime;

        // Trim command
        const args = [
            '-i', inputName,
            '-ss', startTime.toString(),
            '-t', duration.toString(),
            '-c:v', outputFormat === 'webm' ? 'libvpx-vp9' : 'libx264',
            '-c:a', outputFormat === 'webm' ? 'libopus' : 'aac',
            '-preset', 'ultrafast',
            outputName
        ];

        await ffmpeg.exec(args);

        // Read output file
        const data = await ffmpeg.readFile(outputName);

        // Convert FileData (Uint8Array<ArrayBufferLike>) to standard Uint8Array
        const uint8Array = new Uint8Array(data as Uint8Array);

        // Create blob with proper MIME type
        const mimeType = outputFormat === 'mp4' ? 'video/mp4' : 'video/webm';
        const outputBlob = new Blob([uint8Array], { type: mimeType });

        // Clean up
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        return outputBlob;
    },

    /**
     * Get video duration
     * @param videoBlob - Video blob
     * @returns Duration in seconds
     */
    getVideoDuration: (videoBlob: Blob): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };

            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Failed to load video metadata'));
            };

            video.src = URL.createObjectURL(videoBlob);
        });
    },

    /**
     * Check if FFmpeg is loaded
     */
    isLoaded: (): boolean => {
        return isLoaded;
    },
};
