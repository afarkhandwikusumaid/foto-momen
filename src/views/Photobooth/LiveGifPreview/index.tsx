import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sparkles, Play, Pause, Download } from 'lucide-react';

import { FrameColor } from '../../../types';

interface LiveGifPreviewProps {
  photos: string[];
  videos?: Blob[];
  filterCss: string;
  frame: FrameColor;
  caption: string;
}

export interface LiveGifPreviewRef {
  generateVideoBlob: () => Promise<Blob>;
}

const LiveGifPreview = forwardRef<LiveGifPreviewRef, LiveGifPreviewProps>(({
  photos,
  videos,
  filterCss,
  frame,
  caption,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  // Create Object URLs for the videos
  useEffect(() => {
    if (videos && videos.length > 0) {
      const urls = videos.map(v => URL.createObjectURL(v));
      setVideoUrls(urls);
      return () => urls.forEach(u => URL.revokeObjectURL(u));
    }
  }, [videos]);

  // Sync play/pause for all videos
  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (!video) return;
      if (isPlaying) {
        video.play().catch(e => console.error("Video play error", e));
      } else {
        video.pause();
      }
    });
  }, [isPlaying, videoUrls]);

  const generateVideoBlob = async (): Promise<Blob> => {
    if (!frame.imageUrl || !videos || videos.length === 0) {
      throw new Error("Cannot generate video: missing frame or videos");
    }

    const canvas = document.createElement('canvas');
    const imgOverlay = new Image();
    imgOverlay.crossOrigin = "anonymous";
    
    await new Promise((resolve, reject) => {
      imgOverlay.onload = resolve;
      imgOverlay.onerror = reject;
      imgOverlay.src = frame.imageUrl!;
    });

    canvas.width = imgOverlay.width;
    canvas.height = imgOverlay.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("No context");

    const vids = videoRefs.current.filter(v => v !== null) as HTMLVideoElement[];
    vids.forEach(v => {
      v.currentTime = 0;
      v.play();
    });

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = e => chunks.push(e.data);

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
      
      recorder.onerror = reject;
      recorder.start();

      let animationFrame: number;
      const draw = () => {
        ctx.fillStyle = frame.hex || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        frame.photoAreas?.forEach((area, idx) => {
          const vid = videoRefs.current[idx];
          if (vid && vid.readyState >= 2) {
             const dx = (area.x / 100) * canvas.width;
             const dy = (area.y / 100) * canvas.height;
             const dw = (area.width / 100) * canvas.width;
             const dh = (area.height / 100) * canvas.height;
             
             const vidAspect = vid.videoWidth / vid.videoHeight;
             const destAspect = dw / dh;
             let sx = 0, sy = 0, sw = vid.videoWidth, sh = vid.videoHeight;
             if (vidAspect > destAspect) {
               sw = vid.videoHeight * destAspect;
               sx = (vid.videoWidth - sw) / 2;
             } else {
               sh = vid.videoWidth / destAspect;
               sy = (vid.videoHeight - sh) / 2;
             }
             
             ctx.save();
             ctx.filter = filterCss;
             ctx.translate(dx + dw / 2, dy + dh / 2);
             ctx.scale(-1, 1);
             ctx.drawImage(vid, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
             ctx.restore();
          }
        });

        ctx.drawImage(imgOverlay, 0, 0, canvas.width, canvas.height);

        if (recorder.state === 'recording') {
          animationFrame = requestAnimationFrame(draw);
        }
      };
      
      draw();

      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
        cancelAnimationFrame(animationFrame);
      }, 2000);
    });
  };

  useImperativeHandle(ref, () => ({
    generateVideoBlob
  }));

  const handleDownload = async () => {
    if (isDownloading || !frame.imageUrl) return;
    setIsDownloading(true);

    try {
      const blob = await generateVideoBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Live_FotoMomen_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white p-5 rounded-[28px] shadow-xl border border-slate-800 space-y-4 select-none w-full max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-pink-400">
          <Sparkles className="h-4 w-4 text-[#ff007f] animate-pulse" /> Live Photo Strip
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading || !frame.imageUrl || videos?.length === 0}
            className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition flex items-center gap-1 cursor-pointer"
          >
            {isDownloading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Download className="w-3 h-3" />}
            <span>Download</span>
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 transition flex items-center gap-1 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto bg-white border border-slate-200/20 shadow-inner transition duration-300 relative rounded-md overflow-hidden"
        style={{ 
          backgroundColor: frame.hex || '#ffffff',
          width: '100%',
          aspectRatio: frame.imageUrl ? undefined : '2/3',
        }}
      >
        {frame.imageUrl ? (
           // Render with Custom Frame Image Overlay
           <div className="relative w-full h-auto">
             <img src={frame.imageUrl} alt="Frame Base" className="w-full h-auto opacity-0" />
             {frame.photoAreas?.map((area, idx) => {
               const vUrl = videoUrls[idx] || videoUrls[0];
               const pUrl = photos[idx] || photos[0];
               return (
                 <div key={idx} className="absolute overflow-hidden bg-black"
                   style={{
                     left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%`, height: `${area.height}%`
                   }}
                 >
                   {vUrl ? (
                     <video
                       ref={el => { videoRefs.current[idx] = el; }}
                       src={vUrl}
                       autoPlay muted loop playsInline
                       className="w-full h-full object-cover scale-x-[-1]"
                       style={{ filter: filterCss }}
                     />
                   ) : (
                     <img src={pUrl} className="w-full h-full object-cover" style={{ filter: filterCss }} />
                   )}
                 </div>
               );
             })}
             <img src={frame.imageUrl} alt="Frame Overlay" className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none object-fill" />
           </div>
        ) : (
           // Legacy Layout Fallback (just display a stack)
           <div className="p-4 flex flex-col gap-2">
             {photos.map((p, idx) => (
                <div key={idx} className="w-full aspect-[4/3] bg-black rounded overflow-hidden">
                   {videoUrls[idx] ? (
                     <video
                       ref={el => { videoRefs.current[idx] = el; }}
                       src={videoUrls[idx]}
                       autoPlay muted loop playsInline
                       className="w-full h-full object-cover scale-x-[-1]"
                       style={{ filter: filterCss }}
                     />
                   ) : (
                     <img src={p} className="w-full h-full object-cover" style={{ filter: filterCss }} />
                   )}
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
);

export default LiveGifPreview;
