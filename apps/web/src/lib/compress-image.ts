/**
 * Client-side image compression utility for the invoice generator.
 *
 * Uses browser-image-compression for now as a pragmatic choice that works
 * without special server headers.
 *
 * TODO: Consider upgrading to wasm-vips for better compression quality.
 * wasm-vips requires Cross-Origin-Embedder-Policy (COEP) and
 * Cross-Origin-Opener-Policy (COOP) headers, which currently conflict with
 * Google Forms embeds used elsewhere on the site.
 *
 * When browser support for `credentialless` iframes improves, we can:
 * 1. Add `credentialless` attribute to Google Forms iframes
 * 2. Enable COEP/COOP headers site-wide (or per-route)
 * 3. Switch to wasm-vips for superior compression
 *
 * Browser support for credentialless iframes:
 * @see https://caniuse.com/mdn-html_elements_iframe_credentialless
 *
 * wasm-vips library:
 * @see https://github.com/kleisauke/wasm-vips
 */

import type { Options } from "browser-image-compression";

/** Default compression options optimized for receipt photos */
const DEFAULT_OPTIONS: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 2048,
  useWebWorker: true,
  fileType: "image/jpeg",
  initialQuality: 0.8,
};

/**
 * Check if a file is a compressible image type
 */
export function isCompressibleImage(file: File): boolean {
  const compressibleTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
  ];
  return compressibleTypes.includes(file.type);
}

/**
 * Compress an image file using browser-image-compression.
 * Returns the original file if it's not a compressible image type.
 *
 * @param file - The file to compress
 * @param options - Optional compression options to override defaults
 * @returns Promise resolving to the compressed file (or original if not an image)
 */
export async function compressImage(
  file: File,
  options?: Partial<Options>,
): Promise<File> {
  if (!isCompressibleImage(file)) {
    return file;
  }

  // Lazy load the compression library
  const imageCompression = await import("browser-image-compression").then(
    (mod) => mod.default,
  );

  const mergedOptions: Options = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  try {
    const compressedBlob = await imageCompression(file, mergedOptions);

    // Preserve original filename but potentially change extension for JPEG conversion
    let filename = file.name;
    if (
      mergedOptions.fileType === "image/jpeg" &&
      !filename.toLowerCase().endsWith(".jpg") &&
      !filename.toLowerCase().endsWith(".jpeg")
    ) {
      // Replace extension with .jpg for converted files
      const lastDot = filename.lastIndexOf(".");
      if (lastDot > 0) {
        filename = `${filename.substring(0, lastDot)}.jpg`;
      } else {
        filename = `${filename}.jpg`;
      }
    }

    return new File([compressedBlob], filename, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn("Image compression failed, using original file:", error);
    return file;
  }
}

/**
 * Compress multiple files, processing images and passing through other file types.
 *
 * @param files - Array of files to process
 * @param options - Optional compression options
 * @returns Promise resolving to array of processed files
 */
export async function compressImages(
  files: File[],
  options?: Partial<Options>,
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}
