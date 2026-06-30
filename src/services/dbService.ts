// Supabase imports
import { supabase, isSupabaseReady } from '../supabase/config';

// Types
export interface BookingInquiry {
  name: string;
  email: string;
  eventDate: string;
  eventType: string;
  notes: string;
  createdAt?: number;
}

export interface PhotoSessionMetadata {
  layout: string;
  frameColorId: string;
  filter: string;
  stickerText: string;
  showDate: boolean;
}

export async function ensureAuth(): Promise<string | null> {
  if (!isSupabaseReady) {
    console.warn('Mode Frontend Only Aktif: Menggunakan Data Lokal.');
    return 'local_anon_user';
  }
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      return 'supabase_anonymous_user';
    }
    return data.user?.id || 'supabase_anonymous_user';
  } catch (err) {
    console.error('Supabase auth error:', err);
    return 'supabase_anonymous_user';
  }
}

/**
 * Uploads a custom template frame image (PNG transparent).
 */
export async function uploadTemplateImage(file: File): Promise<string> {
  if (!isSupabaseReady) {
    throw new Error('Koneksi Supabase diperlukan untuk mengunggah gambar frame.');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `frame_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('photobooth')
    .upload(`frames/${fileName}`, file, {
      contentType: file.type,
      upsert: true
    });
    
  if (uploadError) throw uploadError;
  
  const { data: urlData } = supabase.storage
    .from('photobooth')
    .getPublicUrl(`frames/${fileName}`);
    
  return urlData.publicUrl;
}

/**
 * Uploads a photo session's final render and saves metadata.
 */
export async function uploadPhotoSession(
  finalBase64: string,
  metadata: PhotoSessionMetadata
): Promise<{ sessionId: string; shareUrl: string; imageUrl: string }> {
  
  if (!isSupabaseReady) {
    throw new Error('Supabase unconfigured. Please configure Supabase to upload photo sessions.');
  }

  try {
    const uid = await ensureAuth();
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const filename = `${uid}/${sessionId}.png`;

    // Convert base64 data to Blob
    const response = await fetch(finalBase64);
    const blob = await response.blob();

    // 1. Upload to Supabase Storage Bucket 'photobooth'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photobooth')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from('photobooth')
      .getPublicUrl(filename);
    const imageUrl = urlData.publicUrl;

    // 3. Save metadata record into database table 'photo_sessions'
    const { data: dbData, error: dbError } = await supabase
      .from('photo_sessions')
      .insert([
        {
          session_id: sessionId,
          user_id: uid,
          image_url: imageUrl,
          layout: metadata.layout,
          frame_color_id: metadata.frameColorId,
          filter: metadata.filter,
          sticker_text: metadata.stickerText,
          show_date: metadata.showDate,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) throw dbError;

    const recordId = dbData && dbData.length > 0 ? dbData[0].id : sessionId;
    const shareUrl = `${window.location.origin}?share=${recordId}`;

    return { sessionId: recordId.toString(), shareUrl, imageUrl };
  } catch (err) {
    console.error('Supabase upload failed:', err);
    throw err;
  }
}


/**
 * Retrieves a photo session by ID.
 */
export async function getPhotoSession(docId: string): Promise<any> {
  if (!isSupabaseReady) {
    throw new Error('Supabase unconfigured.');
  }

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
    console.error('Supabase fetch photo session failed:', err);
    return null;
  }
}

/**
 * Retrieves past user sessions.
 */
export async function getUserSessions(): Promise<any[]> {
  if (!isSupabaseReady) {
    throw new Error('Supabase unconfigured.');
  }

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
    console.error('Supabase get user sessions failed:', err);
    return [];
  }
}

/**
 * Saves a rental/booking inquiry from the landing page contact form.
 */
export async function saveBookingInquiry(inquiry: BookingInquiry): Promise<string> {
  if (!isSupabaseReady) {
    throw new Error('Supabase unconfigured. Please configure Supabase to save bookings.');
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: inquiry.name,
          email: inquiry.email,
          event_date: inquiry.eventDate,
          event_type: inquiry.eventType,
          notes: inquiry.notes,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0].id.toString() : 'booking_success';
  } catch (err) {
    console.error('Supabase save booking failed:', err);
    throw err;
  }
}

/**
 * Retrieves event bookings list by email (for customer lookup).
 */
export async function getBookingsByEmail(email: string): Promise<any[]> {
  if (!isSupabaseReady) {
    throw new Error('Supabase unconfigured.');
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map((b: any) => ({
      id: b.id.toString(),
      name: b.name,
      email: b.email,
      eventDate: b.event_date || b.eventDate,
      eventType: b.event_type || b.eventType,
      notes: b.notes,
      status: b.status || 'Pending',
      createdAt: new Date(b.created_at).getTime()
    }));
  } catch (err) {
    console.error('Supabase fetch bookings failed:', err);
    return [];
  }
}

/**
 * Fetches dynamic frame templates configured by admin (mocked/fallback if empty).
 */
export async function getFrameTemplates(): Promise<any[]> {
  if (!isSupabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('active', true);
    if (error || !data) return [];
    
    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      hex: t.hex,
      textColor: t.text_color,
      borderClass: t.border_class,
      imageUrl: t.image_url,
    }));
  } catch (err) {
    console.error('Supabase get templates failed:', err);
    return [];
  }
}

// Premium feature types
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

// Preset fallbacks
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

// 1. BACKDROPS CRUD
export async function getBackdrops(): Promise<CustomBackdrop[]> {
  if (!isSupabaseReady) {
    return DEFAULT_BACKDROPS;
  }
  try {
    const { data, error } = await supabase.from('backdrops').select('*');
    if (error || !data) return DEFAULT_BACKDROPS;
    return data;
  } catch (err) {
    console.error('Supabase fetch backdrops failed:', err);
    return DEFAULT_BACKDROPS;
  }
}

export async function saveBackdrop(bd: CustomBackdrop): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('backdrops').insert([bd]);
}

export async function updateBackdrop(bd: CustomBackdrop): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('backdrops').update(bd).eq('id', bd.id);
}

export async function deleteBackdrop(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('backdrops').delete().eq('id', id);
}

// 2. STICKERS CRUD
export async function getStickers(): Promise<CustomSticker[]> {
  if (!isSupabaseReady) {
    return DEFAULT_STICKERS;
  }
  try {
    const { data, error } = await supabase.from('stickers').select('*');
    if (error || !data) return DEFAULT_STICKERS;
    return data;
  } catch (err) {
    console.error('Supabase fetch stickers failed:', err);
    return DEFAULT_STICKERS;
  }
}

export async function saveSticker(st: CustomSticker): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('stickers').insert([st]);
}

export async function updateSticker(st: CustomSticker): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('stickers').update(st).eq('id', st.id);
}

export async function deleteSticker(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('stickers').delete().eq('id', id);
}

// 3. FONTS CRUD
export async function getFonts(): Promise<CustomFont[]> {
  if (!isSupabaseReady) {
    return DEFAULT_FONTS;
  }
  try {
    const { data, error } = await supabase.from('fonts').select('*');
    if (error || !data) return DEFAULT_FONTS;
    return data;
  } catch (err) {
    console.error('Supabase fetch fonts failed:', err);
    return DEFAULT_FONTS;
  }
}

export async function saveFont(f: CustomFont): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('fonts').insert([f]);
}

export async function updateFont(f: CustomFont): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('fonts').update(f).eq('id', f.id);
}

export async function deleteFont(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase unconfigured.');
  await supabase.from('fonts').delete().eq('id', id);
}

