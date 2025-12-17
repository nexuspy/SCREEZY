'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { BrutalistButton } from '@/components/kinetic';
import { Scissors, Download, Upload } from 'lucide-react';
import { ffmpegUtils } from '@/lib/ffmpeg';

interface VideoTrimmerProps {
    initialVideoBlob?: Blob;
    onTrimComplete?: (trimmedBlob: Blob) => void;
}

export function VideoTrimmer({ initialVideoBlob, onTrimComplete }: VideoTrimmerProps) {
    const [videoBlob, setVideoBlob] = useState<Blob | null>(initialVideoBlob || null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isTrimming, setIsTrimming] = useState(false);
    const [trimmedBlob, setTrimmedBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ffmpegProgress, setFfmpegProgress] = useState(0);
    const [outputFormat, setOutputFormat] = useState<'webm' | 'mp4'>('webm');

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (videoBlob && videoRef.current) {
            const video = videoRef.current;

            const handleLoadedMetadata = () => {
                setVideoDuration(video.duration);
                setEndTime(video.duration);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(video.currentTime);
            };

            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [videoBlob]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setError('PLEASE SELECT A VALID VIDEO FILE');
            return;
        }

        setError(null);
        setVideoBlob(file);
        setTrimmedBlob(null);
    }, []);

    const handleTrim = useCallback(async () => {
        if (!videoBlob) return;

        setError(null);
        setIsTrimming(true);
        setFfmpegProgress(0);

        try {
            await ffmpegUtils.load((progress) => {
                setFfmpegProgress(progress);
            });

            const trimmed = await ffmpegUtils.trimVideo(
                videoBlob,
                startTime,
                endTime,
                outputFormat
            );

            setTrimmedBlob(trimmed);

            if (onTrimComplete) {
                onTrimComplete(trimmed);
            }
        } catch (err: any) {
            console.error('Trim error:', err);
            setError(err.message || 'FAILED TO TRIM VIDEO. PLEASE TRY AGAIN.');
        } finally {
            setIsTrimming(false);
            setFfmpegProgress(0);
        }
    }, [videoBlob, startTime, endTime, outputFormat, onTrimComplete]);

    const downloadTrimmed = useCallback(() => {
        if (!trimmedBlob) return;

        const url = URL.createObjectURL(trimmedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trimmed-${Date.now()}.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [trimmedBlob, outputFormat]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {error && (
                <div className="border-2 border-destructive bg-destructive/10 text-destructive p-6 mb-8 uppercase tracking-wider">
                    {error}
                </div>
            )}

            <div className="border-2 border-border p-12">
                <div className="mb-8">
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-2">
                        VIDEO TRIMMER
                    </h2>
                    <p className="text-lg text-muted-foreground uppercase tracking-wider">
                        PRECISION EDITING WITH FFMPEG.WASM
                    </p>
                </div>

                {!videoBlob ? (
                    <div className="text-center py-16 border-2 border-dashed border-border">
                        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                        <p className="text-xl text-muted-foreground uppercase tracking-wider mb-6">
                            UPLOAD A VIDEO TO START TRIMMING
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <BrutalistButton onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2 inline" />
                            UPLOAD VIDEO
                        </BrutalistButton>
                    </div>
                ) : (
                    <>
                        {/* Video Preview */}
                        <div className="mb-8 border-2 border-border">
                            <video
                                ref={videoRef}
                                src={trimmedBlob ? URL.createObjectURL(trimmedBlob) : URL.createObjectURL(videoBlob)}
                                controls
                                className="w-full"
                            />
                        </div>

                        {/* Trim Controls */}
                        {!trimmedBlob && (
                            <div className="space-y-6 mb-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                                            START TIME
                                        </label>
                                        <input
                                            type="text"
                                            value={formatTime(startTime)}
                                            readOnly
                                            className="w-full h-16 px-0 bg-transparent border-0 border-b-2 border-border text-2xl font-bold uppercase tracking-tighter focus:outline-none focus:border-accent"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={videoDuration}
                                            step="0.1"
                                            value={startTime}
                                            onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.1))}
                                            className="w-full mt-4 h-2 bg-border rounded-none appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                                            END TIME
                                        </label>
                                        <input
                                            type="text"
                                            value={formatTime(endTime)}
                                            readOnly
                                            className="w-full h-16 px-0 bg-transparent border-0 border-b-2 border-border text-2xl font-bold uppercase tracking-tighter focus:outline-none focus:border-accent"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={videoDuration}
                                            step="0.1"
                                            value={endTime}
                                            onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.1))}
                                            className="w-full mt-4 h-2 bg-border rounded-none appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                                    DURATION: {formatTime(endTime - startTime)} • ORIGINAL: {formatTime(videoDuration)}
                                </p>

                                {/* Output Format */}
                                <div>
                                    <p className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                                        OUTPUT FORMAT
                                    </p>
                                    <div className="flex gap-2">
                                        <BrutalistButton
                                            variant={outputFormat === 'webm' ? 'primary' : 'outline'}
                                            onClick={() => setOutputFormat('webm')}
                                            size="sm"
                                        >
                                            WEBM
                                        </BrutalistButton>
                                        <BrutalistButton
                                            variant={outputFormat === 'mp4' ? 'primary' : 'outline'}
                                            onClick={() => setOutputFormat('mp4')}
                                            size="sm"
                                        >
                                            MP4
                                        </BrutalistButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {!trimmedBlob ? (
                                <>
                                    <BrutalistButton
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                    >
                                        CHANGE VIDEO
                                    </BrutalistButton>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <BrutalistButton
                                        onClick={handleTrim}
                                        disabled={isTrimming}
                                        className="flex-1"
                                    >
                                        {isTrimming ? (
                                            <>
                                                <Scissors className="w-4 h-4 mr-2 inline" />
                                                TRIMMING... {ffmpegProgress > 0 && `${ffmpegProgress}%`}
                                            </>
                                        ) : (
                                            <>
                                                <Scissors className="w-4 h-4 mr-2 inline" />
                                                TRIM VIDEO
                                            </>
                                        )}
                                    </BrutalistButton>
                                </>
                            ) : (
                                <>
                                    <BrutalistButton
                                        onClick={() => {
                                            setTrimmedBlob(null);
                                            setStartTime(0);
                                            setEndTime(videoDuration);
                                        }}
                                        variant="outline"
                                    >
                                        TRIM AGAIN
                                    </BrutalistButton>
                                    <BrutalistButton onClick={downloadTrimmed} className="flex-1">
                                        <Download className="w-4 h-4 mr-2 inline" />
                                        DOWNLOAD TRIMMED VIDEO
                                    </BrutalistButton>
                                </>
                            )}
                        </div>

                        {trimmedBlob && (
                            <p className="text-sm uppercase tracking-wider text-muted-foreground mt-4">
                                TRIMMED SIZE: {(trimmedBlob.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
