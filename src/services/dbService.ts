// Supabase imports
import { supabase, isSupabaseReady } from '../config/supabase';

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

export interface CustomBackdrop {
  id: string;
  name: string;
  value: string;
  active: boolean;
}

export interface CustomSticker {
  id: string;
  emoji: string;
  category: string;
  active: boolean;
}

export interface CustomFont {
  id: string;
  name: string;
  displayName: string;
  active: boolean;
}

// ============================================================
// Preset fallbacks (used when DB tables are empty)
// ============================================================

export const DEFAULT_BACKDROPS: CustomBackdrop[] = [
  { id: 'bd_1', name: 'Pastel Peach', value: 'linear-gradient(135deg, #ffd3b6 0%, #ffaaa5 100%)', active: true },
  { id: 'bd_2', name: 'Neon Cyber', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', active: true },
  { id: 'bd_3', name: 'Soft Mint', value: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)', active: true },
  { id: 'bd_4', name: 'Floral Rose', value: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)', active: true }
];

export const DEFAULT_STICKERS: CustomSticker[] = [
  { id: 'st_1', emoji: '✨', category: 'Cute', active: true },
  { id: 'st_2', emoji: '🎀', category: 'Cute', active: true },
  { id: 'st_3', emoji: '🌸', category: 'Cute', active: true },
  { id: 'st_4', emoji: '💕', category: 'Cute', active: true },
  { id: 'st_5', emoji: '🎉', category: 'Party', active: true },
  { id: 'st_6', emoji: '🎈', category: 'Party', active: true },
  { id: 'st_7', emoji: '🎂', category: 'Party', active: true },
  { id: 'st_8', emoji: '👑', category: 'Cool', active: true },
  { id: 'st_9', emoji: '🕶️', category: 'Cool', active: true },
  { id: 'st_10', emoji: '📸', category: 'Cool', active: true }
];

export const DEFAULT_FONTS: CustomFont[] = [
  { id: 'f_1', name: 'Poppins', displayName: 'Poppins Clean', active: true },
  { id: 'f_2', name: 'Pacifico', displayName: 'Retro Cursive', active: true },
  { id: 'f_3', name: 'Playfair Display', displayName: 'Serif Classic', active: true },
  { id: 'f_4', name: 'Lilita One', displayName: 'Lilita Chubby', active: true }
];

// ============================================================
// Auth
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
 * Requires the 'photobooth' bucket to be public and RLS to allow authenticated uploads.
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
    .upload(filePath, file, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    console.error('Storage upload error detail:', uploadError);
    throw new Error(`Gagal upload gambar ke storage: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('photobooth')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// ============================================================
// Storage — Photo Session
// ============================================================

/**
 * Uploads a finished photobooth session image and saves its metadata to DB.
 */
export async function uploadPhotoSession(
  finalBase64: string,
  metadata: PhotoSessionMetadata,
  videoBlob?: Blob
): Promise<{ sessionId: string; shareUrl: string; imageUrl: string; videoUrl?: string }> {

  if (!isSupabaseReady) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const uid = await ensureAuth();
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const filename = `${uid}/${sessionId}.png`;
  const videoFilename = `${uid}/${sessionId}.webm`;

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
    .upload(filename, blob, { contentType: blob.type, upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('photobooth').getPublicUrl(filename);
  const imageUrl = urlData.publicUrl;

  // Upload video if present
  let videoUrl: string | undefined = undefined;
  if (videoBlob) {
    const { error: videoUploadError } = await supabase.storage
      .from('photobooth')
      .upload(videoFilename, videoBlob, { contentType: 'video/webm', upsert: true });
    
    if (!videoUploadError) {
      const { data: videoUrlData } = supabase.storage.from('photobooth').getPublicUrl(videoFilename);
      videoUrl = videoUrlData.publicUrl;
    }
  }

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
    }])
    .select();

  if (dbError) throw dbError;

  const recordId = dbData && dbData.length > 0 ? dbData[0].id : sessionId;
  const shareUrl = `${window.location.origin}?share=${recordId}`;

  return { sessionId: recordId.toString(), shareUrl, imageUrl, videoUrl };
}

// ============================================================
// Photo Sessions — Read
// ============================================================

export async function getPhotoSession(docId: string): Promise<any> {
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

export async function getUserSessions(): Promise<any[]> {
  if (!isSupabaseReady) return [];

  try {
    const uid = await ensureAuth();
    const { data, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return [];

    return data.map((item: any) => ({
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
    console.error('getUserSessions error:', err);
    return [];
  }
}

export async function getAllSessions(): Promise<any[]> {
  if (!isSupabaseReady) return [];

  try {
    const { data, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
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
 * Fetches all active frame templates from DB.
 */
export async function getFrameTemplates(): Promise<any[]> {
  if (!isSupabaseReady) return [];

  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((t: any) => {
      let parsedPhotoAreas = undefined;
      if (t.layout && t.layout.startsWith('[')) {
        try {
          parsedPhotoAreas = JSON.parse(t.layout);
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
        photoAreas: parsedPhotoAreas
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
export async function saveTemplate(template: any): Promise<void> {
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
    photo_count: template.photoCount || 4,
    active: template.active !== undefined ? template.active : true
  };

  const { error } = await supabase.from('templates').upsert([dbTemplate]);
  if (error) {
    console.error('saveTemplate upsert error:', error);
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

// ============================================================
// Backdrops CRUD
// ============================================================

export async function getBackdrops(): Promise<CustomBackdrop[]> {
  if (!isSupabaseReady) return DEFAULT_BACKDROPS;
  try {
    const { data, error } = await supabase.from('backdrops').select('*');
    if (error || !data || data.length === 0) return DEFAULT_BACKDROPS;
    return data;
  } catch {
    return DEFAULT_BACKDROPS;
  }
}

export async function saveBackdrop(bd: CustomBackdrop): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('backdrops').insert([bd]);
}

export async function updateBackdrop(bd: CustomBackdrop): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('backdrops').update(bd).eq('id', bd.id);
}

export async function deleteBackdrop(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('backdrops').delete().eq('id', id);
}

// ============================================================
// Stickers CRUD
// ============================================================

export async function getStickers(): Promise<CustomSticker[]> {
  if (!isSupabaseReady) return DEFAULT_STICKERS;
  try {
    const { data, error } = await supabase.from('stickers').select('*');
    if (error || !data || data.length === 0) return DEFAULT_STICKERS;
    return data;
  } catch {
    return DEFAULT_STICKERS;
  }
}

export async function saveSticker(st: CustomSticker): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('stickers').insert([st]);
}

export async function updateSticker(st: CustomSticker): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('stickers').update(st).eq('id', st.id);
}

export async function deleteSticker(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('stickers').delete().eq('id', id);
}

// ============================================================
// Fonts CRUD
// ============================================================

export async function getFonts(): Promise<CustomFont[]> {
  if (!isSupabaseReady) return DEFAULT_FONTS;
  try {
    const { data, error } = await supabase.from('fonts').select('*');
    if (error || !data || data.length === 0) return DEFAULT_FONTS;
    return data;
  } catch {
    return DEFAULT_FONTS;
  }
}

export async function saveFont(f: CustomFont): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('fonts').insert([f]);
}

export async function updateFont(f: CustomFont): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('fonts').update(f).eq('id', f.id);
}

export async function deleteFont(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  await supabase.from('fonts').delete().eq('id', id);
}
