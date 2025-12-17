import { notFound } from 'next/navigation';
import { videoDb, analyticsDb } from '@/lib/db';
import { storage } from '@/lib/storage';
import { VideoPlayer } from '@/components/features/player/VideoPlayer';
import { Card, CardContent } from '@/components/ui';
import { Eye, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WatchPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const video = videoDb.getByToken(token);

    if (!video) {
        notFound();
    }

    const analytics = analyticsDb.get(video.id);
    const videoUrl = storage.getPublicUrl(video.filename);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Video Player */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {video.original_filename || 'Shared Video'}
                    </h1>
                    <VideoPlayer src={videoUrl} videoId={video.id} />
                </div>

                {/* Video Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Views</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {analytics?.views || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Shared On</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(video.created_at * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Share Link */}
                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Share this video:</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/watch/${token}`}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/watch/${token}`
                                    );
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
