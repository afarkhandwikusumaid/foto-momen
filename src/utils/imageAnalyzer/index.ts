import { PhotoArea } from '../../types';

export interface DetectionResult {
  holes: PhotoArea[];
  processedImageUrl: string | null;
}

/**
 * Mengecek apakah pixel merupakan target lubang (Transparan, Putih, atau Hijau Green Screen)
 */
function isTargetPixel(r: number, g: number, b: number, a: number): boolean {
  // Transparan (Alpha sangat rendah)
  if (a <= 20) return true;
  
  // Khusus warna Green Screen (Chroma Key) dengan toleransi anti-aliasing/kompresi JPEG
  // Kita buat lebih pemaaf agar pinggiran (fringe) yang agak pudar tetap terhapus
  // Syarat: Warna hijau harus dominan
  if (g > 120 && g > r * 1.4 && g > b * 1.4) return true;
  if (g > 150 && r < 100 && b < 100) return true;
  
  return false;
}

/**
 * Menganalisis gambar PNG (dari URL/ObjectURL) untuk menemukan
 * kotak-kotak lubang foto. Mendeteksi area transparan, putih bersih, atau hijau terang.
 * Area yang memenuhi syarat akan diubah menjadi transparan (Alpha = 0).
 */
export async function detectTransparentHoles(imageUrl: string): Promise<DetectionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Jika dari external URL
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
         reject(new Error('Canvas 2D context not available'));
         return;
      }
      
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      
      // Array penanda pixel yang sudah dicek
      const visited = new Uint8Array(width * height);
      const holes: PhotoArea[] = [];
      
      // Area minimal untuk dianggap sebagai lubang foto (2% dari total area)
      const MIN_AREA_PIXELS = (width * height) * 0.02; 
      
      // Antrean untuk algoritma Flood Fill (BFS) menggunakan TypedArray agar super cepat
      const qx = new Int32Array(width * height);
      const qy = new Int32Array(width * height);
      
      // Variabel untuk melacak apakah ada pixel yang dimodifikasi
      let imageModified = false;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (visited[idx]) continue;
          
          const r = data[(idx * 4)];
          const g = data[(idx * 4) + 1];
          const b = data[(idx * 4) + 2];
          const a = data[(idx * 4) + 3];
          
          if (isTargetPixel(r, g, b, a)) {
             // Ditemukan pixel target baru! Mulai pencarian Flood Fill.
             let minX = x;
             let maxX = x;
             let minY = y;
             let maxY = y;
             let areaCount = 0;
             
             let head = 0;
             let tail = 0;
             
             qx[tail] = x;
             qy[tail] = y;
             tail++;
             visited[idx] = 1;
             
             while (head < tail) {
               const cx = qx[head];
               const cy = qy[head];
               head++;
               areaCount++;
               
               if (cx < minX) minX = cx;
               if (cx > maxX) maxX = cx;
               if (cy < minY) minY = cy;
               if (cy > maxY) maxY = cy;
               
               // Cek tetangga (Atas, Bawah, Kiri, Kanan)
               const neighbors = [
                 [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
               ];
               
               for (let i = 0; i < neighbors.length; i++) {
                 const nx = neighbors[i][0];
                 const ny = neighbors[i][1];
                 
                 if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                   const nIdx = ny * width + nx;
                   if (!visited[nIdx]) {
                     const nr = data[(nIdx * 4)];
                     const ng = data[(nIdx * 4) + 1];
                     const nb = data[(nIdx * 4) + 2];
                     const na = data[(nIdx * 4) + 3];
                     
                     if (isTargetPixel(nr, ng, nb, na)) {
                       visited[nIdx] = 1;
                       qx[tail] = nx;
                       qy[tail] = ny;
                       tail++;
                     } else {
                       visited[nIdx] = 1; 
                     }
                   }
                 }
               }
             }
             
             // Jika lubang cukup besar, simpan sebagai area foto
             if (areaCount >= MIN_AREA_PIXELS) {
                holes.push({
                  x: (minX / width) * 100,
                  y: (minY / height) * 100,
                  width: ((maxX - minX + 1) / width) * 100,
                  height: ((maxY - minY + 1) / height) * 100,
                });
                
                // Dilation: Set semua pixel di area ini, beserta 1 pixel tetangganya menjadi transparan (Alpha = 0)
                // Ini memastikan sisa anti-aliasing di ujung (edge) benar-benar terhapus bersih.
                imageModified = true;
                
                // Buat salinan buffer sementara untuk mencegah efek berantai (chain effect)
                // tapi karena kita cuma menghapus alpha, kita bisa langsung timpa.
                for (let i = 0; i < tail; i++) {
                  const px = qx[i];
                  const py = qy[i];
                  
                  // Radius ekspansi = 1 pixel
                  for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                      const nx = px + dx;
                      const ny = py + dy;
                      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nIdx = ny * width + nx;
                        data[(nIdx * 4) + 3] = 0; // Alpha = 0
                      }
                    }
                  }
                }
             }
          } else {
             visited[idx] = 1; // Pixel padat (non-target)
          }
        }
      }
      
      // Urutkan lubang dari atas ke bawah, lalu kiri ke kanan
      holes.sort((a, b) => {
        if (Math.abs(a.y - b.y) < 5) return a.x - b.x;
        return a.y - b.y;
      });
      
      if (imageModified) {
        ctx.putImageData(imgData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              holes,
              processedImageUrl: URL.createObjectURL(blob)
            });
          } else {
            resolve({ holes, processedImageUrl: null });
          }
        }, 'image/png');
      } else {
        resolve({ holes, processedImageUrl: null });
      }
    };
    
    img.onerror = () => reject(new Error('Gagal memuat gambar untuk analisis'));
    img.src = imageUrl;
  });
}
