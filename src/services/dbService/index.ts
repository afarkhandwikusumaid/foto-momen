import { supabase, isSupabaseReady } from '../../config/supabase';

// ============================================================
// Types
// ============================================================

export interface PhotoSessionMetadata {
  layout: string;
  frameColorId: string;
  filter: string;
  stickerText: string;
  showDate: boolean;
}

export interface PhotoSession {
  id: string;
  sessionId: string;
  imageUrl: string;
  layout: string;
  frameColorId: string;
  filter: string;
  stickerText: string;
  showDate: boolean;
  createdAt: number;
}

export interface FrameTemplate {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  borderClass: string;
  imageUrl?: string;
  layout: string;
  active: boolean;
  photoCount: number;
  photoAreas?: { x: number; y: number; width: number; height: number }[];
}

// ============================================================
// Auth — anonymous sign-in for session tracking
// ============================================================

export async function ensureAuth(): Promise<string | null> {
  if (!isSupabaseReady) return 'local_anon_user';
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) return 'supabase_anonymous_user';
    return data.user?.id || 'supabase_anonymous_user';
  } catch {
    return 'supabase_anonymous_user';
  }
}

// ============================================================
// Storage — Template Frame Image
// ============================================================

/**
 * Uploads a custom template frame image (PNG transparent) to Supabase Storage.
 * Requires the 'photobooth' bucket to be public.
 */
export async function uploadTemplateImage(file: File): Promise<string> {
  if (!isSupabaseReady) {
    throw new Error('Koneksi Supabase diperlukan untuk mengunggah gambar frame.');
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `frame_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `frames/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('photobooth')
    .upload(filePath, file, { contentType: file.type || 'image/png' });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Gagal upload gambar ke storage: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from('photobooth').getPublicUrl(filePath);
  return urlData.publicUrl;
}

// ============================================================
// Storage — Photo Session
// ============================================================

/**
 * Uploads a finished photobooth session image and saves metadata to DB.
 * Optionally uploads a live video blob alongside the image.
 */
export async function uploadPhotoSession(
  finalBase64: string,
  metadata: PhotoSessionMetadata,
  videoBlob?: Blob,
  existingSessionId?: string
): Promise<{ sessionId: string; shareUrl: string; imageUrl: string; videoUrl?: string }> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');

  const uid = await ensureAuth();
  const sessionId = existingSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const filename = `${uid}/${sessionId}.png`;
  
  const isGif = videoBlob?.type === 'image/gif';
  const videoExt = isGif ? 'gif' : 'webm';
  const videoFilename = `${uid}/${sessionId}.${videoExt}`;

  // Convert base64 to Blob
  let response = await fetch(finalBase64);
  let blob = await response.blob();

  // Compress if > 2MB
  const MAX_SIZE = 2 * 1024 * 1024;
  if (blob.size > MAX_SIZE) {
    const img = new Image();
    img.src = finalBase64;
    await new Promise(resolve => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d')!.drawImage(img, 0, 0);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    response = await fetch(compressedDataUrl);
    blob = await response.blob();

    if (blob.size > MAX_SIZE) {
      throw new Error('Gambar terlalu besar (lebih dari 2MB) setelah dikompresi.');
    }
  }

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from('photobooth')
    .upload(filename, blob, { contentType: blob.type });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('photobooth').getPublicUrl(filename);
  const imageUrl = urlData.publicUrl;

  // Upload live video if present
  let videoUrl: string | undefined;
  if (videoBlob) {
    const { error: videoUploadError } = await supabase.storage
      .from('photobooth')
      .upload(videoFilename, videoBlob, { contentType: videoBlob.type || 'video/webm' });

    if (!videoUploadError) {
      const { data: videoUrlData } = supabase.storage.from('photobooth').getPublicUrl(videoFilename);
      videoUrl = videoUrlData.publicUrl;
    }
  }

  // Save session record to DB
  const { data: dbData, error: dbError } = await supabase
    .from('photo_sessions')
    .insert([{
      session_id: sessionId,
      user_id: uid,
      image_url: imageUrl,
      layout: metadata.layout,
      frame_color_id: metadata.frameColorId,
      filter: metadata.filter,
      sticker_text: metadata.stickerText,
      show_date: metadata.showDate,
      created_at: new Date().toISOString()
    }], { onConflict: 'session_id' })
    .select();

  if (dbError) throw dbError;

  const recordId = dbData && dbData.length > 0 ? dbData[0].id : sessionId;
  const shareUrl = `${window.location.origin}?share=${recordId}`;

  return { sessionId: recordId.toString(), shareUrl, imageUrl, videoUrl };
}

// ============================================================
// Photo Sessions — Read
// ============================================================

export async function getPhotoSession(docId: string): Promise<PhotoSession | null> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');

  try {
    const { data, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .or(`id.eq.${docId},session_id.eq.${docId}`)
      .single();

    if (error || !data) return null;

    return {
      id: data.id.toString(),
      sessionId: data.session_id,
      imageUrl: data.image_url,
      layout: data.layout,
      frameColorId: data.frame_color_id,
      filter: data.filter,
      stickerText: data.sticker_text,
      showDate: data.show_date,
      createdAt: new Date(data.created_at).getTime()
    };
  } catch (err) {
    console.error('getPhotoSession error:', err);
    return null;
  }
}

export async function getAllSessions(): Promise<PhotoSession[]> {
  if (!isSupabaseReady) return [];

  try {
    const { data, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(item => ({
      id: item.id.toString(),
      sessionId: item.session_id,
      imageUrl: item.image_url,
      layout: item.layout,
      frameColorId: item.frame_color_id,
      filter: item.filter,
      stickerText: item.sticker_text,
      showDate: item.show_date,
      createdAt: new Date(item.created_at).getTime()
    }));
  } catch (err) {
    console.error('getAllSessions error:', err);
    return [];
  }
}

// ============================================================
// Frame Templates — CRUD
// ============================================================

/**
 * Fetches all frame templates from DB.
 */
export async function getFrameTemplates(): Promise<FrameTemplate[]> {
  if (!isSupabaseReady) return [];

  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(t => {
      let photoAreas: FrameTemplate['photoAreas'];
      if (t.layout && t.layout.startsWith('[')) {
        try {
          photoAreas = JSON.parse(t.layout);
        } catch (e) {
          console.error('Failed to parse photoAreas JSON:', e);
        }
      }
      return {
        id: t.id,
        name: t.name,
        hex: t.hex,
        textColor: t.text_color,
        borderClass: t.border_class,
        imageUrl: t.image_url,
        layout: t.layout,
        active: t.active,
        photoCount: t.photo_count || 4,
        photoAreas
      };
    });
  } catch (err) {
    console.error('getFrameTemplates error:', err);
    return [];
  }
}

/**
 * Saves (upserts) a frame template to DB.
 */
export async function saveTemplate(template: Partial<FrameTemplate> & { id: string }): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');

  const dbTemplate = {
    id: template.id,
    name: template.name,
    hex: template.hex || '#ffffff',
    text_color: template.textColor || '#000000',
    border_class: template.borderClass || 'border-slate-200',
    image_url: template.imageUrl,
    layout: typeof template.layout === 'object'
      ? JSON.stringify(template.layout)
      : (template.layout || 'vertical-strip'),
    photo_count: (template as any).photoCount || 4,
    active: template.active !== undefined ? template.active : true
  };

  const { error } = await supabase.from('templates').upsert([dbTemplate]);
  if (error) {
    console.error('saveTemplate error:', error);
    throw new Error(`Gagal menyimpan template: ${error.message}`);
  }
}

/**
 * Deletes a frame template by ID.
 */
export async function deleteTemplate(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');

  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) {
    console.error('deleteTemplate error:', error);
    throw new Error(`Gagal menghapus template: ${error.message}`);
  }
}
