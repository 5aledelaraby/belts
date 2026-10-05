// Filled by scripts/build.tsx after sharp has produced the responsive images.

export interface ImageSet {
  /** Smallest file, used as the plain `src`. */
  src: string;
  /** All widths, for `srcset`. */
  srcset: string;
  /** Largest file, for the zoom view. */
  large: string;
  width: number;
  height: number;
}

export const images: Record<string, ImageSet> = {};

export const img = (key: string): ImageSet => {
  const set = images[key];
  if (!set) throw new Error(`Missing image: ${key}`);
  return set;
};

/** Filled by scripts/build.tsx: source file name → hashed public URL. */
export const videos: Record<string, string> = {};
