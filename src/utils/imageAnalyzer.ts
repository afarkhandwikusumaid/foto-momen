export interface PhotoArea {
  x: number;      // persentase (0-100)
  y: number;      // persentase (0-100)
  width: number;  // persentase (0-100)
  height: number; // persentase (0-100)
}

/**
 * Menganalisis gambar PNG (dari URL/ObjectURL) untuk menemukan
 * kotak-kotak transparan (alpha <= threshold).
 * Mengembalikan array Bounding Box dalam format persentase.
 */
export async function detectTransparentHoles(imageUrl: string): Promise<PhotoArea[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Jika dari external URL
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Membantu performa saat getImageData
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
      
      // Toleransi pixel transparan (0-255)
      const ALPHA_THRESHOLD = 20; 
      // Area minimal untuk dianggap sebagai lubang foto (misal: 2% dari total area)
      const MIN_AREA_PIXELS = (width * height) * 0.02; 
      
      // Antrean untuk algoritma Flood Fill (BFS) menggunakan TypedArray agar super cepat
      const qx = new Int32Array(width * height);
      const qy = new Int32Array(width * height);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (visited[idx]) continue;
          
          const alpha = data[(idx * 4) + 3]; // Komponen Alpha (A dari RGBA)
          
          if (alpha <= ALPHA_THRESHOLD) {
             // Ditemukan pixel transparan baru! Mulai pencarian Flood Fill.
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
                     const nAlpha = data[(nIdx * 4) + 3];
                     if (nAlpha <= ALPHA_THRESHOLD) {
                       visited[nIdx] = 1;
                       qx[tail] = nx;
                       qy[tail] = ny;
                       tail++;
                     } else {
                       // Tandai non-transparan agar tak dicek ulang
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
             }
          } else {
             visited[idx] = 1; // Pixel padat (non-transparan)
          }
        }
      }
      
      // Urutkan lubang dari atas ke bawah, lalu kiri ke kanan
      holes.sort((a, b) => {
        // Jika posisinya di baris yang kurang lebih sama (selisih Y < 5%), urutkan berdasar X (kiri ke kanan)
        if (Math.abs(a.y - b.y) < 5) {
          return a.x - b.x;
        }
        // Jika tidak, urutkan berdasar Y (atas ke bawah)
        return a.y - b.y;
      });
      
      resolve(holes);
    };
    
    img.onerror = () => reject(new Error('Gagal memuat gambar untuk analisis'));
    img.src = imageUrl;
  });
}
