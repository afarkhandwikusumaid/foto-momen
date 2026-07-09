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
  eventCode?: string;
}

export interface CustomRoute {
  id: string;
  slug: string;
  routeType: 'company' | 'yearbook' | 'event';
  title: string;
  description?: string;
  targetId?: string;
  createdAt: string;
}

// ============================================================
// Private Helpers (mappers — tidak diekspor)
// ============================================================

function mapSession(item: any): PhotoSession {
  return {
    id: item.id.toString(),
    sessionId: item.session_id,
    imageUrl: item.image_url,
    layout: item.layout,
    frameColorId: item.frame_color_id,
    filter: item.filter,
    stickerText: item.sticker_text,
    showDate: item.show_date,
    createdAt: new Date(item.created_at).getTime(),
  };
}

function mapTemplate(t: any): FrameTemplate {
  let photoAreas: FrameTemplate['photoAreas'];
  if (t.layout?.startsWith('[')) {
    try { photoAreas = JSON.parse(t.layout); }
    catch { /* keep undefined */ }
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
    photoAreas,
    eventCode: t.event_code || undefined,
  };
}

function mapRoute(r: any): CustomRoute {
  return {
    id: r.id.toString(),
    slug: r.slug,
    routeType: r.route_type as CustomRoute['routeType'],
    title: r.title,
    description: r.description || undefined,
    targetId: r.target_id || undefined,
    createdAt: r.created_at,
  };
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

export async function uploadTemplateImage(file: File): Promise<string> {
  if (!isSupabaseReady) throw new Error('Koneksi Supabase diperlukan untuk mengunggah gambar frame.');

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `frame_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `frames/${fileName}`;

  const { error } = await supabase.storage
    .from('photobooth')
    .upload(filePath, file, { contentType: file.type || 'image/png' });

  if (error) throw new Error(`Gagal upload gambar ke storage: ${error.message}`);

  return supabase.storage.from('photobooth').getPublicUrl(filePath).data.publicUrl;
}

// ============================================================
// Storage — Photo Session
// ============================================================

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
  const videoExt = videoBlob?.type === 'image/gif' ? 'gif' : 'webm';
  const videoFilename = `${uid}/${sessionId}.${videoExt}`;

  // Convert base64 → Blob, compress if > 2 MB
  let response = await fetch(finalBase64);
  let blob = await response.blob();
  const MAX_SIZE = 2 * 1024 * 1024;
  if (blob.size > MAX_SIZE) {
    const img = new Image();
    img.src = finalBase64;
    await new Promise(resolve => { img.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    response = await fetch(canvas.toDataURL('image/jpeg', 0.8));
    blob = await response.blob();
    if (blob.size > MAX_SIZE) throw new Error('Gambar terlalu besar (lebih dari 2MB) setelah dikompresi.');
  }

  const { error: uploadError } = await supabase.storage.from('photobooth').upload(filename, blob, { contentType: blob.type });
  if (uploadError) throw uploadError;

  const imageUrl = supabase.storage.from('photobooth').getPublicUrl(filename).data.publicUrl;

  let videoUrl: string | undefined;
  if (videoBlob) {
    const { error: videoErr } = await supabase.storage
      .from('photobooth')
      .upload(videoFilename, videoBlob, { contentType: videoBlob.type || 'video/webm' });
    if (!videoErr) {
      videoUrl = supabase.storage.from('photobooth').getPublicUrl(videoFilename).data.publicUrl;
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
      created_at: new Date().toISOString(),
    }], { onConflict: 'session_id' })
    .select();

  if (dbError) throw dbError;

  const recordId = dbData?.length ? dbData[0].id : sessionId;
  return { sessionId: recordId.toString(), shareUrl: `${window.location.origin}?share=${recordId}`, imageUrl, videoUrl };
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
    return mapSession(data);
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
    return data.map(mapSession);
  } catch (err) {
    console.error('getAllSessions error:', err);
    return [];
  }
}

// ============================================================
// Frame Templates — CRUD
// ============================================================

export async function getFrameTemplates(options?: { includePrivate?: boolean; eventCode?: string }): Promise<FrameTemplate[]> {
  if (!isSupabaseReady) return [];
  try {
    let query = supabase.from('templates').select('*');
    if (options?.eventCode) {
      query = query.eq('event_code', options.eventCode);
    } else if (!options?.includePrivate) {
      query = query.is('event_code', null);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(mapTemplate);
  } catch (err) {
    console.error('getFrameTemplates error:', err);
    return [];
  }
}

export async function getFrameTemplate(id: string): Promise<FrameTemplate | null> {
  if (!isSupabaseReady) return null;
  try {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapTemplate(data);
  } catch (err) {
    console.error('getFrameTemplate error:', err);
    return null;
  }
}

export async function saveTemplate(template: Partial<FrameTemplate> & { id: string }): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  const { error } = await supabase.from('templates').upsert([{
    id: template.id,
    name: template.name,
    hex: template.hex || '#ffffff',
    text_color: template.textColor || '#000000',
    border_class: template.borderClass || 'border-slate-200',
    image_url: template.imageUrl,
    layout: typeof template.layout === 'object' ? JSON.stringify(template.layout) : (template.layout || 'vertical-strip'),
    photo_count: (template as any).photoCount || 4,
    event_code: template.eventCode || null,
    active: template.active !== undefined ? template.active : true,
  }]);
  if (error) throw new Error(`Gagal menyimpan template: ${error.message}`);
}

export async function deleteTemplate(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus template: ${error.message}`);
}

// ============================================================
// Custom Routes — CRUD
// ============================================================

export async function getCustomRoute(slug: string): Promise<CustomRoute | null> {
  if (!isSupabaseReady) return null;
  try {
    const { data, error } = await supabase.from('custom_routes').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return mapRoute(data);
  } catch (err) {
    console.error('getCustomRoute error:', err);
    return null;
  }
}

export async function getCustomRoutes(): Promise<CustomRoute[]> {
  if (!isSupabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('custom_routes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(mapRoute);
  } catch (err) {
    console.error('getCustomRoutes error:', err);
    return [];
  }
}

export async function getAssociatedYearbookRoutes(companySlug: string): Promise<CustomRoute[]> {
  if (!isSupabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('custom_routes')
      .select('*')
      .eq('route_type', 'yearbook')
      .like('slug', `${companySlug}/%`)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(mapRoute);
  } catch (err) {
    console.error('getAssociatedYearbookRoutes error:', err);
    return [];
  }
}

export async function saveCustomRoute(route: Partial<CustomRoute> & { slug: string }): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  const dbRoute: any = {
    slug: route.slug,
    route_type: route.routeType,
    title: route.title,
    description: route.description || null,
    target_id: route.targetId || null,
  };
  if (route.id) dbRoute.id = parseInt(route.id, 10);
  const { error } = await supabase.from('custom_routes').upsert([dbRoute]);
  if (error) throw new Error(`Gagal menyimpan rute custom: ${error.message}`);
}

export async function deleteCustomRoute(id: string): Promise<void> {
  if (!isSupabaseReady) throw new Error('Supabase belum dikonfigurasi.');
  const { error } = await supabase.from('custom_routes').delete().eq('id', parseInt(id, 10));
  if (error) throw new Error(`Gagal menghapus rute custom: ${error.message}`);
}
