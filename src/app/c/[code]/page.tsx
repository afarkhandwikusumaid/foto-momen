'use client';

import { use } from 'react';
import StudioPage from '../../../views/StudioPage';

export default function EventStudioRoute({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  return <StudioPage eventCode={resolvedParams.code} />;
}
