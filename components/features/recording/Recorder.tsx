'use client';

import { useState, useRef, useCallback } from 'react';
import { BrutalistButton } from '@/components/kinetic';
import { Video, Square, Download, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';

interface RecorderProps {
    onRecordingComplete?: (blob: Blob, duration: number) => void;
}

export function Recorder({ onRecordingComplete }: RecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [includeAudio, setIncludeAudio] = useState(true);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number>(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);

            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
                audio: false,
            });

            let audioStream: MediaStream | null = null;

            if (includeAudio) {
                try {
                    audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
                    });
                } catch (audioError) {
                    console.warn('Could not access microphone:', audioError);
                    setIncludeAudio(false);
                }
            }

            const tracks = [...displayStream.getVideoTracks()];
            if (audioStream) {
                tracks.push(...audioStream.getAudioTracks());
            }

            const combinedStream = new MediaStream(tracks);
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm';

            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType,
                videoBitsPerSecond: 2500000,
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setRecordedBlob(blob);
                const recordDuration = (Date.now() - startTimeRef.current) / 1000;
                setDuration(recordDuration);

                if (onRecordingComplete) {
                    onRecordingComplete(blob, recordDuration);
                }

                combinedStream.getTracks().forEach(track => track.stop());
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                }
            };

            displayStream.getVideoTracks()[0].onended = () => {
                if (isRecording) {
                    stopRecording();
                }
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
            startTimeRef.current = Date.now();

            timerIntervalRef.current = setInterval(() => {
                setDuration((Date.now() - startTimeRef.current) / 1000);
            }, 100);

        } catch (err: any) {
            console.error('Error starting recording:', err);
            setError(err.message || 'Failed to start recording. Please grant permission to capture screen.');
        }
    }, [includeAudio, isRecording, onRecordingComplete]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    const downloadRecording = useCallback(() => {
        if (!recordedBlob) return;

        const url = URL.createObjectURL(recordedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [recordedBlob]);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Link href="/" className="inline-block text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8">
                ← BACK TO HOME
            </Link>

            {error && (
                <div className="border-2 border-destructive bg-destructive/10 text-destructive p-6 mb-8 uppercase tracking-wider">
                    {error}
                </div>
            )}

            <div className="border-2 border-border p-12">
                <div className="mb-8">
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-2">
                        SCREEN RECORDER
                    </h2>
                    <p className="text-lg text-muted-foreground uppercase tracking-wider">
                        CAPTURE YOUR SCREEN IN HD QUALITY
                    </p>
                </div>

                {/* Recording Status */}
                {isRecording && (
                    <div className="flex items-center gap-4 mb-8 p-6 border-2 border-accent bg-accent/10">
                        <div className="w-4 h-4 bg-destructive rounded-full animate-pulse" />
                        <span className="text-3xl font-bold font-mono uppercase tracking-wider">
                            {formatDuration(duration)}
                        </span>
                        <span className="text-sm uppercase tracking-wider text-muted-foreground">
                            RECORDING
                        </span>
                    </div>
                )}

                {/* Audio Toggle */}
                {!isRecording && !recordedBlob && (
                    <div className="mb-8">
                        <BrutalistButton
                            variant={includeAudio ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setIncludeAudio(!includeAudio)}
                        >
                            {includeAudio ? <Mic className="w-4 h-4 mr-2 inline" /> : <MicOff className="w-4 h-4 mr-2 inline" />}
                            MICROPHONE {includeAudio ? 'ON' : 'OFF'}
                        </BrutalistButton>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4">
                    {!isRecording && !recordedBlob && (
                        <BrutalistButton
                            onClick={startRecording}
                            size="lg"
                            className="flex-1"
                        >
                            <Video className="w-5 h-5 mr-2 inline" />
                            START RECORDING
                        </BrutalistButton>
                    )}

                    {isRecording && (
                        <BrutalistButton
                            onClick={stopRecording}
                            variant="outline"
                            size="lg"
                            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                            <Square className="w-5 h-5 mr-2 inline" />
                            STOP RECORDING
                        </BrutalistButton>
                    )}

                    {recordedBlob && (
                        <>
                            <BrutalistButton
                                onClick={() => {
                                    setRecordedBlob(null);
                                    setDuration(0);
                                }}
                                variant="outline"
                            >
                                RECORD AGAIN
                            </BrutalistButton>
                            <BrutalistButton
                                onClick={downloadRecording}
                                className="flex-1"
                            >
                                <Download className="w-5 h-5 mr-2 inline" />
                                DOWNLOAD RECORDING
                            </BrutalistButton>
                        </>
                    )}
                </div>

                {/* Preview */}
                {recordedBlob && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">
                            PREVIEW
                        </h3>
                        <div className="border-2 border-border">
                            <video
                                src={URL.createObjectURL(recordedBlob)}
                                controls
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-8 mt-4 text-sm uppercase tracking-wider text-muted-foreground">
                            <span>DURATION: {formatDuration(duration)}</span>
                            <span>SIZE: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
