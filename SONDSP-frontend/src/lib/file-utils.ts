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

export async function downloadUrl(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao baixar o arquivo.");
    
    const blob = await response.blob();
    
    const file = blobToFile(blob, fileName);
    
    const blobUrl = window.URL.createObjectURL(file);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.name;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Erro ao realizar o download:", error);
    window.open(url, "_blank");
  }
}

export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

export const FILE_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,image/*,application/pdf";