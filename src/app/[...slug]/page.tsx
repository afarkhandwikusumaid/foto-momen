'use client';

import { use } from 'react';
import ProfilePage from '../../views/ProfilePage';

export default function CustomRoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  // Extract slug dari parameter route (array of string)
  // Contoh: fotomomen.com/lentera/12a => slug = ['lentera', '12a'] => digabung jadi 'lentera/12a'
  const resolvedParams = use(params);
  const fullSlug = resolvedParams.slug.join('/');
  
  return <ProfilePage slugPath={fullSlug} />;
}
