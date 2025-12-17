'use client';

import { useState, useRef } from 'react';
import { BrutalistButton } from '@/components/kinetic';
import { Upload, Check, Copy, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('video/')) {
            setError('PLEASE SELECT A VALID VIDEO FILE');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setUploadResult(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('video', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'UPLOAD FAILED');
            }

            setUploadResult(data);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'FAILED TO UPLOAD VIDEO');
        } finally {
            setUploading(false);
        }
    };

    const copyLink = () => {
        if (!uploadResult?.shareUrl) return;

        navigator.clipboard.writeText(uploadResult.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-block text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8">
                    ← BACK TO HOME
                </Link>

                {error && (
                    <div className="border-2 border-destructive bg-destructive/10 text-destructive p-6 mb-8 uppercase tracking-wider flex items-start justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="border-2 border-border p-12">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-2">
                            UPLOAD & SHARE
                        </h1>
                        <p className="text-lg text-muted-foreground uppercase tracking-wider">
                            GET YOUR SHAREABLE LINK
                        </p>
                    </div>

                    {!uploadResult ? (
                        <>
                            {/* File Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${file ? 'border-accent bg-accent/10' : 'border-border hover:border-border/50'
                                    }`}
                            >
                                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                                {file ? (
                                    <>
                                        <p className="text-2xl font-bold uppercase tracking-tighter text-foreground mb-2">{file.name}</p>
                                        <p className="text-sm uppercase tracking-wider text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xl uppercase tracking-wider text-muted-foreground mb-2">
                                            CLICK TO SELECT A VIDEO
                                        </p>
                                        <p className="text-sm uppercase tracking-wider text-muted-foreground">
                                            OR DRAG AND DROP
                                        </p>
                                    </>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Upload Button */}
                            {file && (
                                <div className="mt-8 space-y-4">
                                    <BrutalistButton
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {uploading ? (
                                            <>UPLOADING...</>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 mr-2 inline" />
                                                UPLOAD VIDEO
                                            </>
                                        )}
                                    </BrutalistButton>
                                    <BrutalistButton
                                        onClick={() => setFile(null)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        CANCEL
                                    </BrutalistButton>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="mb-8 p-8 border-2 border-accent bg-accent/10">
                                <div className="flex items-center gap-4 mb-4">
                                    <Check className="w-8 h-8 text-accent" />
                                    <div>
                                        <h3 className="text-2xl font-bold uppercase tracking-tighter">UPLOAD SUCCESSFUL!</h3>
                                        <p className="text-sm uppercase tracking-wider text-muted-foreground">YOUR VIDEO IS READY TO SHARE</p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Link */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    SHARE LINK
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={uploadResult.shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 border-2 border-border bg-muted text-sm font-mono uppercase"
                                    />
                                    <BrutalistButton onClick={copyLink} variant="outline">
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2 inline" />
                                                COPIED!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2 inline" />
                                                COPY
                                            </>
                                        )}
                                    </BrutalistButton>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <BrutalistButton
                                    onClick={() => window.open(uploadResult.shareUrl, '_blank')}
                                    className="flex-1"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2 inline" />
                                    VIEW VIDEO
                                </BrutalistButton>
                                <BrutalistButton
                                    onClick={() => {
                                        setFile(null);
                                        setUploadResult(null);
                                    }}
                                    variant="outline"
                                >
                                    UPLOAD ANOTHER
                                </BrutalistButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
