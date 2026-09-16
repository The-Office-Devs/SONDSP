export function blobToFile(blob: Blob, name: string): File {
  const type = blob.type || "application/octet-stream";

  let extension = "";
  if (type === "application/pdf") extension = ".pdf";
  else if (type === "image/jpeg") extension = ".jpg";
  else if (type === "image/png") extension = ".png";
  else if (type === "image/webp") extension = ".webp";

  const safeName = name.replace(/[^a-zA-Z0-9 ]/g, "");
  return new File([blob], `${safeName}${extension}`, { type });
}

export function downloadUrl(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "modelo_atividade";
  document.body.appendChild(a);
  a.click();
  a.remove();
}