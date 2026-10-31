// Laskugeneraattori only takes these, judged by the file extension
const PASS_THROUGH = /\.(gif|svg|pdf)$/i;
const RE_ENCODABLE = /\.(jpe?g|png)$/i;

// 3000 × 2250 is about 250 dpi on an A4 page, enough to read small receipt print. Capping the
// pixel count rather than the long side keeps long receipts and full-page screenshots readable.
// The server embeds the image in the PDF as is.
const MAX_PIXELS = 3000 * 2250;
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

  const converted = await toJpeg(file).catch(() => null);
  if (converted && (!accepted || converted.size < file.size)) {
    const name = file.name.replace(/\.[^.]*$/, "") || "image";
    return new File([converted], `${name}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  }

  // The server would reject the original, so say so before upload
  if (!accepted) throw new UnsupportedFileError(file.name);
  return file;
}

async function toJpeg(file: File): Promise<Blob | null> {
  // Applies the EXIF orientation, so rotated phone photos stay upright
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    Math.sqrt(MAX_PIXELS / (bitmap.width * bitmap.height)),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return null;
  }

  // JPEG has no transparency, so transparent PNG areas would otherwise turn black
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
}
