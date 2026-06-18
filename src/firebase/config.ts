import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDoc, doc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Init Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cek apakah Firebase sudah dikonfigurasi
export const isFirebaseReady = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

/**
 * Auto sign-in anonim saat pertama kali
 * Panggil ini di App.tsx useEffect
 */
export async function ensureAuth(): Promise<string | null> {
  if (!isFirebaseReady) return null;
  try {
    if (!auth.currentUser) {
      const cred = await signInAnonymously(auth);
      return cred.user.uid;
    }
    return auth.currentUser.uid;
  } catch (err) {
    console.error('Auth error:', err);
    return null;
  }
}

/**
 * Upload foto ke Firebase Storage dan simpan metadata ke Firestore
 * Returns: { sessionId, shareUrl } — shareUrl adalah URL halaman share
 */
export async function uploadPhotoSession(
  finalBase64: string,
  metadata: {
    layout: string;
    frameColorId: string;
    filter: string;
    stickerText: string;
    showDate: boolean;
  }
): Promise<{ sessionId: string; shareUrl: string; imageUrl: string }> {
  const uid = await ensureAuth();
  if (!uid) throw new Error('Autentikasi gagal');

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Upload gambar ke Firebase Storage
  const storageRef = ref(storage, `photobooth/${uid}/${sessionId}.png`);
  const base64Data = finalBase64.replace(/^data:image\/\w+;base64,/, '');
  const snapshot = await uploadString(storageRef, base64Data, 'base64', {
    contentType: 'image/png',
  });
  const imageUrl = await getDownloadURL(snapshot.ref);

  // 2. Simpan metadata ke Firestore
  const docRef = await addDoc(collection(db, 'photo_sessions'), {
    sessionId,
    userId: uid,
    imageUrl,
    ...metadata,
    createdAt: Date.now(),
  });

  // 3. Buat share URL (domain saat ini + query param)
  const shareUrl = `${window.location.origin}?share=${docRef.id}`;

  return { sessionId: docRef.id, shareUrl, imageUrl };
}

/**
 * Ambil data sesi dari Firestore berdasarkan Firestore document ID
 */
export async function getPhotoSession(docId: string) {
  try {
    const snap = await getDoc(doc(db, 'photo_sessions', docId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as any;
    }
    return null;
  } catch (err) {
    console.error('Gagal mengambil sesi:', err);
    return null;
  }
}

/**
 * Ambil riwayat foto user saat ini dari Firestore (10 terakhir)
 */
export async function getUserSessions(): Promise<any[]> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    // Gunakan simple query - tidak perlu composite index
    const q = query(
      collection(db, 'photo_sessions'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((s: any) => s.userId === uid);
  } catch (err) {
    console.error('Gagal mengambil riwayat:', err);
    return [];
  }
}
