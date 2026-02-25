import { put, del } from "@vercel/blob";

export async function uploadFile(
  file: File | Blob,
  filename: string,
  folder = "uploads"
): Promise<string> {
  const blob = await put(`${folder}/${filename}`, file, {
    access: "public",
  });
  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}
