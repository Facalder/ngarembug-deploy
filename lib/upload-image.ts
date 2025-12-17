import { createId } from "@paralleldrive/cuid2";
import { getBucketName } from "@/lib/storage-constants";
import { supabase } from "@/lib/supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface BulkUploadResult {
  success: boolean;
  results: UploadResult[];
  errors?: string[];
}

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: string = getBucketName(),
  folder: string = "uncategorized",
  customFileName?: string,
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = customFileName || `${createId()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * Upload multiple images in parallel
 */
export async function uploadBulkImages(
  files: File[],
  bucket: string = getBucketName(),
  _prefix: string = "",
  folder: string = "uncategorized",
  _category: string = "uncategorized",
): Promise<BulkUploadResult> {
  const uploadPromises = files.map((file) => uploadImage(file, bucket, folder));

  const results = await Promise.all(uploadPromises);
  const errors = results
    .filter((r) => !r.success)
    .map((r) => r.error)
    .filter(Boolean) as string[];

  const allSuccess = results.every((r) => r.success);

  return {
    success: allSuccess,
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Delete an image from storage
 */
export async function deleteImage(
  path: string,
  bucket: string = getBucketName(),
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}
/**
 * Delete multiple images from storage
 */
export async function deleteManyImages(
  paths: string[],
  bucket: string = getBucketName(),
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}
