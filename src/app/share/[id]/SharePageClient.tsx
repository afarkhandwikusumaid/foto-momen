'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SharePageClientProps {
  id: string;
  initialSession: any;
}

export default function SharePageClient({ id, initialSession }: SharePageClientProps) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialSession);

  useEffect(() => {
    if (session?.image_url) {
      const checkExt = async (ext: string) => {
        const vUrl = session.image_url.replace('.png', ext);
        try {
          const res = await fetch(vUrl, { method: 'HEAD' });
          if (res.ok) return vUrl;
        } catch (e) {}
        return null;
      };

      checkExt('.mp4').then(url => {
        if (url) {
          setHasVideo(true);
          setVideoUrl(url);
        } else {
          checkExt('.gif').then(url2 => {
            if (url2) {
              setHasVideo(true);
              setVideoUrl(url2);
            } else {
              checkExt('.webm').then(url3 => {
                if (url3) {
                  setHasVideo(true);
                  setVideoUrl(url3);
                }
              });
            }
          });
        }
      });
    }
    setIsLoading(false);
  }, [session]);

  const handleDownload = async () => {
    if (!session?.image_url) return;
    try {
      const response = await fetch(session.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `foto-momen-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ext = videoUrl.endsWith('.webm') ? '.webm' : videoUrl.endsWith('.mp4') ? '.mp4' : '.gif';
      a.download = `Live_FotoMomen_${Date.now()}${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Memuat foto momen...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center py-12 px-4">
          <span className="text-5xl">😕</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Foto tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">Link ini mungkin sudah kadaluarsa atau tidak valid.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-md transition duration-200"
          >
            Buat Foto Kamu Sendiri
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-md">
          <span className="text-4xl">📸</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">Foto Momen Bersama</h2>
          <p className="text-slate-500 text-sm mb-6">
            Seseorang membagikan momen bahagianya denganmu!
          </p>

          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-block mb-6 max-w-full">
            {hasVideo && videoUrl ? (
              videoUrl.endsWith('.webm') || videoUrl.endsWith('.mp4') ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="max-h-[55vh] object-contain rounded-xl"
                />
              ) : (
                <img
                  src={videoUrl}
                  alt="Foto Momen Live GIF"
                  className="max-h-[55vh] object-contain rounded-xl"
                />
              )
            ) : (
              <img
                src={session.image_url}
                alt="Foto Momen Shared"
                className="max-h-[55vh] object-contain rounded-xl"
              />
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Foto
              </button>
              {hasVideo && videoUrl && (
                <button
                  onClick={handleDownloadVideo}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#ff007f] hover:bg-[#d6006a] text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  {videoUrl.endsWith('.webm') || videoUrl.endsWith('.mp4') ? 'Live Video' : 'Live GIF'}
                </button>
              )}
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
            >
              Mulai Ambil Foto Kamu Sendiri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
