/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivePhase = 'landing' | 'select-frame' | 'camera' | 'live-preview' | 'preview';

export type FrameLayout = 'vertical-strip' | 'grid-2x2' | 'single-polar' | 'triple-strip';

export type PhotoCount = 2 | 3 | 4;

export type BorderStyle = 'thin' | 'classic' | 'thick';

export interface FrameColor {
  id: string;
  name: string;
  bgClass: string;
  hex: string;
  textColor: string;
  borderClass: string;
}

export type PhotoFilter = 'original' | 'grayscale' | 'sepia' | 'vivid' | 'cool' | 'instant';

export interface PhotoboothSession {
  id?: string;
  sessionId?: string;
  layout: FrameLayout;
  frameColorId: string;
  filter: PhotoFilter;
  stickerText: string;
  showDate: boolean;
  imageUrl?: string;
  shareUrl?: string;
  userId?: string;
  createdAt?: number;
}
