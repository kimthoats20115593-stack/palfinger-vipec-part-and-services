// Rotates an already-uploaded (or pasted) image 90° in the browser and
// returns the result as a JPEG blob, ready to re-upload. Used so admins can
// fix a photo's orientation (portrait vs. landscape) without any desktop
// photo editor.
export async function rotateImageClient(src: string, direction: 1 | -1): Promise<Blob> {
  const res = await fetch(src);
  if (!res.ok) throw new Error("fetch_failed");
  const srcBlob = await res.blob();

  const bitmap = await createImageBitmap(srcBlob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.height;
  canvas.height = bitmap.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no_context");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((direction * 90 * Math.PI) / 180);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("blob_failed"))),
      "image/jpeg",
      0.9
    );
  });
}
