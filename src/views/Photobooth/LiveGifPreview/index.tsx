import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sparkles, Play, Pause, Download } from 'lucide-react';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import Swal from 'sweetalert2';

import { FrameColor } from '../../../types';

interface LiveGifPreviewProps {
  photos: string[];
  videos?: Blob[];
  filterCss: string;
  frame: FrameColor;
  caption: string;
}

export interface LiveGifPreviewRef {
  generateVideoBlob: (onProgress?: (progress: number) => void) => Promise<Blob>;
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

  const generateVideoBlob = async (onProgress?: (progress: number) => void): Promise<Blob> => {
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

    // Limit size for reasonable performance and file size
    const MAX_WIDTH = 800; 
    const scale = Math.min(1, MAX_WIDTH / imgOverlay.width);
    // H.264 requires even dimensions
    canvas.width = Math.round((imgOverlay.width * scale) / 2) * 2;
    canvas.height = Math.round((imgOverlay.height * scale) / 2) * 2;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error("No context");

    // Create offscreen video elements in the DOM (hidden) to prevent browser decoding throttling
    const offscreenUrls = videos.map(blob => URL.createObjectURL(blob));
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.overflow = 'hidden';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    const vids = await Promise.all(offscreenUrls.map(url => new Promise<HTMLVideoElement>((res, rej) => {
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.src = url;
      container.appendChild(v);
      
      // Wait for loadeddata to guarantee the browser has processed the initial frames
      v.onloadeddata = () => res(v);
      v.onerror = (e) => rej(e);
    })));

    return new Promise(async (resolve, reject) => {
      const cachedFrames: ImageBitmap[] = [];
      try {
        const fps = 30; // 30 FPS for perfect, ultra-smooth normal speed boomerang
        const baseDurationMs = 1800; // 1.8s base to avoid blank frames at the end of the 2s recording
        const baseFrames = Math.floor(baseDurationMs / 1000 * fps);

        // 1. Capture all forward frames into memory (avoids heavy backward seeking)
        
        for (let i = 0; i < baseFrames; i++) {
          const targetTime = i / fps;
          
          // Seek all videos to targetTime (forward only is fast and stable)
          await Promise.all(vids.map(v => new Promise<void>((res) => {
            if (Math.abs(v.currentTime - targetTime) < 0.01 && v.readyState >= 2) {
              res();
              return;
            }
            
            let resolved = false;
            const resolveSafe = () => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timeoutId);
              v.removeEventListener('seeked', onReady);
              res();
            };

            const onReady = () => {
              if (v.readyState >= 2) {
                resolveSafe();
              }
            };

            const timeoutId = setTimeout(resolveSafe, 300);
            v.addEventListener('seeked', onReady);
            v.currentTime = targetTime;
          })));

          // Draw the composited frame to canvas
          ctx.fillStyle = frame.hex || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          frame.photoAreas?.forEach((area, idx) => {
            const vid = vids[idx] || vids[0];
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

          // Capture the canvas as an ImageBitmap and cache it
          const bitmap = await createImageBitmap(canvas);
          cachedFrames.push(bitmap);

          if (onProgress) {
            onProgress(Math.round((i + 1) / baseFrames * 50)); // First phase: 0% - 50%
          }
        }

        // 2. Generate boomerang sequence
        const cycleFrames: number[] = [];
        for (let i = 0; i < baseFrames; i++) {
          cycleFrames.push(i); // Forward
        }
        for (let i = baseFrames - 2; i > 0; i--) {
          cycleFrames.push(i); // Backward
        }

        // Loop 3 times
        const loopCount = 3;
        const totalSequence: number[] = [];
        for (let i = 0; i < loopCount; i++) {
          totalSequence.push(...cycleFrames);
        }

        let muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: canvas.width,
            height: canvas.height,
            frameRate: fps,
          },
          fastStart: 'in-memory',
        });

        let videoEncoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: e => reject(e)
        });

        videoEncoder.configure({
          codec: 'avc1.4d0028', // Main Profile, Level 4.0 (supports HD at 30 FPS)
          width: canvas.width,
          height: canvas.height,
          bitrate: 3_500_000, // Higher bitrate for HD resolution
          framerate: fps,
        });

        for (let currentFrame = 0; currentFrame < totalSequence.length; currentFrame++) {
          const frameIndex = totalSequence[currentFrame];
          const bitmap = cachedFrames[frameIndex];
          
          // Draw the cached frame back to canvas
          ctx.drawImage(bitmap, 0, 0);

          // Encode the frame to MP4
          // @ts-ignore - TS might not have VideoFrame definitions built-in natively depending on config
          const videoFrame = new VideoFrame(canvas, { 
            timestamp: currentFrame * 1e6 / fps,
            duration: 1e6 / fps
          });
          videoEncoder.encode(videoFrame);
          // @ts-ignore
          videoFrame.close();

          if (onProgress) {
            onProgress(50 + Math.round((currentFrame + 1) / totalSequence.length * 50)); // Second phase: 50% - 100%
          }
        }

        // Finish encoding
        await videoEncoder.flush();
        muxer.finalize();
        
        // Clean up cached bitmaps
        cachedFrames.forEach(b => b.close());

        // Clean up offscreen video elements to free memory
        offscreenUrls.forEach(url => URL.revokeObjectURL(url));
        vids.forEach(v => {
          v.src = '';
          v.load();
        });
        container.remove();

        let buffer = muxer.target.buffer;
        resolve(new Blob([buffer], { type: 'video/mp4' }));
      } catch (e) {
        cachedFrames.forEach(b => b.close());
        offscreenUrls.forEach(url => URL.revokeObjectURL(url));
        container.remove();
        reject(e);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    generateVideoBlob
  }));

  const handleDownload = async () => {
    if (isDownloading || !frame.imageUrl) return;
    setIsDownloading(true);

    // Show Swal progress modal
    Swal.fire({
      title: 'Membuat Live Photo...',
      html: `
        <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative mt-3">
          <div id="swal-progress-bar" class="bg-[#1d90ff] h-4 rounded-full transition-all duration-100" style="width: 0%"></div>
        </div>
        <p id="swal-progress-text" class="text-[12px] font-bold text-slate-500 mt-2">Menyiapkan frame... 0%</p>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const blob = await generateVideoBlob((progress) => {
        const progressBar = document.getElementById('swal-progress-bar');
        const progressText = document.getElementById('swal-progress-text');
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `Me-render video... ${progress}%`;
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Live_FotoMomen_${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      Swal.close();
      setIsDownloading(false);
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white p-5 rounded-[28px] shadow-xl border border-slate-800 space-y-4 select-none w-full max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#1d90ff]">
          <Sparkles className="h-4 w-4 text-[#1d90ff] animate-pulse" /> Live Photo Video
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
