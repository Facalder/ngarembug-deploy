export enum STORAGE_BUCKETS {
  NGAREMBUG_IMAGES = "ngarembug-images",
}

// Helper to get bucket name from environment or fallback to enum
export const getBucketName = () => {
  return (
    process.env.NEXT_PUBLIC_BUCKET_NAME || STORAGE_BUCKETS.NGAREMBUG_IMAGES
  );
};
