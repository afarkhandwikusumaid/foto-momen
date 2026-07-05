import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron handler for cleaning up sessions older than 15 minutes
export async function GET(request: Request) {
  // Check authorization header if you want to secure the cron (optional but recommended in production)
  // Vercel sends a bearer token configured in env VERCEL_CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL_CRON_SECRET && authHeader !== `Bearer ${process.env.VERCEL_CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Waktu 15 menit yang lalu
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  try {
    // 1. Ambil session yang lebih lama dari 15 menit
    const { data: expiredSessions, error: fetchError } = await supabase
      .from('photo_sessions')
      .select('id, image_url')
      .lt('created_at', fifteenMinutesAgo);

    if (fetchError) throw fetchError;
    if (!expiredSessions || expiredSessions.length === 0) {
      return NextResponse.json({ message: 'Tidak ada foto yang kadaluarsa.', deletedCount: 0 });
    }

    const filesToDelete: string[] = [];
    const sessionIdsToDelete: number[] = [];

    // 2. Ekstrak path file untuk Storage
    expiredSessions.forEach((session) => {
      sessionIdsToDelete.push(session.id);
      if (session.image_url) {
        // Asumsi URL format: https://[project_ref].supabase.co/storage/v1/object/public/photobooth/[path...]
        const parts = session.image_url.split('/photobooth/');
        if (parts.length > 1) {
          const filePath = parts[1];
          filesToDelete.push(filePath);
          // Tambahkan juga file video (kalau ada)
          filesToDelete.push(filePath.replace('.png', '.webm'));
        }
      }
    });

    // 3. Hapus file dari Storage
    let storageDeleted = 0;
    if (filesToDelete.length > 0) {
      const { data, error: storageError } = await supabase
        .storage
        .from('photobooth')
        .remove(filesToDelete);
        
      if (storageError) {
        console.error('Storage deletion error:', storageError);
      } else {
        storageDeleted = data?.length || 0;
      }
    }

    // 4. Hapus baris di database
    let dbDeleted = 0;
    if (sessionIdsToDelete.length > 0) {
      const { error: dbError } = await supabase
        .from('photo_sessions')
        .delete()
        .in('id', sessionIdsToDelete);

      if (dbError) throw dbError;
      dbDeleted = sessionIdsToDelete.length;
    }

    return NextResponse.json({
      message: 'Berhasil membersihkan foto kedaluwarsa.',
      deletedDbRows: dbDeleted,
      deletedStorageFiles: storageDeleted,
    });

  } catch (error: any) {
    console.error('Cleanup Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Disable static generation for this route
export const dynamic = 'force-dynamic';
