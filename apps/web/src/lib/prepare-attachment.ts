// Laskugeneraattori only takes these, judged by the file extension
const PASS_THROUGH = /\.(gif|svg|pdf)$/i;
const RE_ENCODABLE = /\.(jpe?g|png)$/i;

// 3000 px on the long side is about 250 dpi on an A4 page, enough to read small receipt print.
// The server embeds the image in the PDF as is.
const MAX_EDGE = 3000;
const JPEG_QUALITY = 0.85;

// Smaller files go as they are: re-encoding them would cost quality for little gain
const KEEP_BELOW: Record<string, number> = {
  "image/jpeg": 1024 * 1024,
  "image/png": 2 * 1024 * 1024,
};

export class UnsupportedFileError extends Error {}

/**
 * Shrinks receipt photos before upload, which keeps invoices under the email size limit and
 * makes uploads finish before the rate limiter can cut them off. Formats the server does not
 * accept, such as WebP, AVIF or HEIC on Safari, are converted to JPEG when the browser can
 * decode them. Re-encoding also drops the photo's metadata, including its location.
 */
export async function prepareAttachment(file: File): Promise<File> {
  if (PASS_THROUGH.test(file.name)) return file;

  const accepted = RE_ENCODABLE.test(file.name);
  if (accepted && file.size < (KEEP_BELOW[file.type] ?? 0)) return file;

  let bitmap: ImageBitmap;
  try {
    // Applies the EXIF orientation, so rotated phone photos stay upright
    bitmap = await createImageBitmap(file);
  } catch {
    if (accepted) return file;
    throw new UnsupportedFileError(file.name);
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return file;

  // JPEG has no transparency, so transparent PNG areas would otherwise turn black
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) return file;
  if (accepted && blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]*$/, "") || "image";
  return new File([blob], `${name}.jpg`, {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });
}
