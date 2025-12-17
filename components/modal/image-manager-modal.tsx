"use client";

import {
  Delete01Icon,
  LayoutGridIcon,
  ListViewIcon,
  Loading01Icon,
  SquareIcon,
  Tick01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import AlertConfirmDialog from "@/components/modal/alert-confirm-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Image as ImageType } from "@/db/schema/images.schema";
import { fetcher, mutationFetcher, swrConfig, uploadFetcher } from "@/lib/swr";
import { cn } from "@/lib/utils";

export interface ImageManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (images: ImageType[]) => void;
  selectedImages?: ImageType[];
  multiple?: boolean;
  maxSelect?: number;
  bucket?: "VENUE_IMAGES" | "VENUE_DETAIL_IMAGES" | string;
}

// Define stable empty array to prevent useEffect infinite loop
const EMPTY_ARRAY: ImageType[] = [];

export function ImageManagerModal({
  open,
  onOpenChange,
  onSelect,
  selectedImages = EMPTY_ARRAY,
  multiple = true,
  maxSelect,
  bucket = "NGAREMBUG_IMAGES",
}: ImageManagerModalProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"browse" | "selected">("browse");

  // Normalize bucket name
  const bucketName = useMemo(() => {
    if (bucket === "NGAREMBUG_IMAGES" || bucket === "ngarembug-images") {
      return "ngarembug-images";
    }
    return bucket;
  }, [bucket]);

  // SWR for fetching images
  const {
    data: fetchResult,
    error: fetchError,
    mutate,
    isLoading: isFetching,
  } = useSWR(
    open ? `/images?bucket=${encodeURIComponent(bucketName)}&limit=50` : null,
    fetcher,
    swrConfig,
  );

  const images: ImageType[] = useMemo(() => {
    if (fetchResult?.data && Array.isArray(fetchResult.data)) {
      return fetchResult.data.filter(
        (img: ImageType) => img?.id && img.fileUrl && img.fileName,
      );
    }
    return [];
  }, [fetchResult]);

  // SWR Mutation for Upload
  const { trigger: uploadTrigger, isMutating: isUploading } = useSWRMutation(
    "/images",
    uploadFetcher,
  );

  // SWR Mutation for Delete
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(
    "/images",
    mutationFetcher,
  );

  useEffect(() => {
    if (open) {
      // Always sync localSelected with selectedImages when modal opens
      const selectedIds = new Set(
        selectedImages.map((img) => img.id).filter(Boolean),
      );
      setLocalSelected(selectedIds);
    } else {
      // Reset when modal closes
      setLocalSelected(new Set());
      setActiveTab("browse");
    }
  }, [open, selectedImages]);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      try {
        const fileArray = Array.from(files);
        const formData = new FormData();

        fileArray.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("bucket", bucketName);
        formData.append("category", "uncategorized");

        const data = await uploadTrigger({ method: "POST", body: formData });

        if (data.success) {
          if (data.saved > 0) {
            toast.success(`Berhasil mengunggah ${data.saved} gambar`);

            // Manually update cache to show images immediately
            if (data.data?.length) {
              mutate((currentData: any) => {
                if (!currentData?.data) return undefined;
                return {
                  ...currentData,
                  data: [...data.data, ...currentData.data],
                };
              }, false); // false = don't revalidate immediately
            } else {
              mutate();
            }
          }
          if (data.errors && data.errors.length > 0) {
            toast.error(`Gagal mengunggah ${data.errors.length} gambar`);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal mengunggah gambar";
        toast.error(errorMessage);
      }
    },
    [uploadTrigger, bucketName, mutate],
  );

  const handleDeleteSelected = useCallback(async () => {
    if (localSelected.size === 0 || isDeleting) return;

    const selectedIds = Array.from(localSelected);
    const previousData = fetchResult;

    // Optimistic update: Filter out deleted images immediately
    if (fetchResult?.data) {
      mutate(
        {
          ...fetchResult,
          data: fetchResult.data.filter(
            (img: ImageType) => !localSelected.has(img.id),
          ),
        },
        false, // Do not revalidate yet
      );
    }

    try {
      setLocalSelected(new Set()); // Clear selection immediately

      const data = await deleteTrigger({
        method: "DELETE",
        body: { ids: selectedIds },
      });

      if (data.success) {
        toast.success(`Berhasil menghapus ${data.deleted?.length || 0} gambar`);
        mutate(); // Revalidate to be sure
      } else {
        throw new Error(data.error || "Gagal menghapus gambar");
      }
    } catch (error) {
      // Rollback on error
      if (previousData) {
        mutate(previousData, false);
      }
      // Restore selection
      setLocalSelected(new Set(selectedIds));

      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus gambar";
      toast.error(errorMessage);
    }
  }, [localSelected, isDeleting, deleteTrigger, mutate, fetchResult]);

  const handleSelectAll = useCallback(() => {
    if (images.length === 0) return;

    const allIds = new Set(images.map((img) => img.id).filter(Boolean));

    if (maxSelect && allIds.size > maxSelect) {
      toast.error(`Maksimal ${maxSelect} gambar dapat dipilih`);
      return;
    }

    setLocalSelected(allIds);
  }, [images, maxSelect]);

  const handleDeselectAll = useCallback(() => {
    setLocalSelected(new Set());
  }, []);

  const toggleImageSelection = useCallback(
    (image: ImageType) => {
      if (!image?.id) {
        return;
      }

      setLocalSelected((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(image.id)) {
          newSet.delete(image.id);
        } else {
          if (!multiple) {
            newSet.clear();
          }
          if (maxSelect && newSet.size >= maxSelect) {
            toast.error(`Maksimal ${maxSelect} gambar dapat dipilih`);
            return prev;
          }
          newSet.add(image.id);
        }
        return newSet;
      });
    },
    [multiple, maxSelect],
  );

  const getSelectedImages = useMemo(() => {
    return images.filter((img) => img?.id && localSelected.has(img.id));
  }, [images, localSelected]);

  const handleFinish = useCallback(() => {
    if (onSelect && getSelectedImages.length > 0) {
      onSelect(getSelectedImages);
    }
    onOpenChange(false);
  }, [onSelect, getSelectedImages, onOpenChange]);

  const selectedCount = localSelected.size;
  const isLoading = isFetching || isUploading || isDeleting;
  const allSelected = images.length > 0 && localSelected.size === images.length;
  const hasSelection = localSelected.size > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col p-0 h-[90vh]">
        <DialogHeader className="relative px-6 pt-6 pb-4 border-b">
          <DialogTitle className="pr-8">Kelola Gambar</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v: string) =>
            setActiveTab(v as "browse" | "selected")
          }
          className="flex flex-col flex-1"
        >
          <div className="px-6 pt-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="selected">
                  Terpilih {selectedCount > 0 && `(${selectedCount})`}
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/png,image/jpeg,image/jpg,image/webp";
                    input.multiple = true;
                    input.onchange = (e) => {
                      handleFileUpload((e.target as HTMLInputElement).files);
                    };
                    input.click();
                  }}
                  disabled={isLoading}
                >
                  {isUploading ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading01Icon}
                        className="mr-2 w-4 h-4 animate-spin"
                      />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon
                        icon={Upload01Icon}
                        className="mr-2 w-4 h-4"
                      />
                      Unggah Gambar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {activeTab === "browse" && (
              <div className="flex justify-between items-center pb-4 flex-wrap gap-y-4">
                <div className="flex items-center gap-2">
                  {images.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={
                          allSelected ? handleDeselectAll : handleSelectAll
                        }
                        disabled={isLoading}
                      >
                        {allSelected ? (
                          <>
                            <HugeiconsIcon
                              icon={SquareIcon}
                              className="mr-2 w-4 h-4"
                            />
                            Batal Pilih Semua
                          </>
                        ) : (
                          <>
                            <HugeiconsIcon
                              icon={SquareIcon}
                              className="mr-2 w-4 h-4"
                            />
                            Pilih Semua
                          </>
                        )}
                      </Button>
                      {hasSelection && (
                        <AlertConfirmDialog
                          trigger={
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isLoading}
                            >
                              <HugeiconsIcon
                                icon={Delete01Icon}
                                className="mr-2 w-4 h-4"
                              />
                              Hapus File Permanen ({selectedCount})
                            </Button>
                          }
                          title="Hapus Gambar Permanen?"
                          description={`Anda yakin ingin menghapus ${selectedCount} gambar ini secara permanen dari server? Gambar yang dihapus akan hilang dari semua halaman yang menggunakannya. Tindakan ini tidak dapat dibatalkan.`}
                          confirmText={
                            isDeleting ? "Menghapus..." : "Hapus Permanen"
                          }
                          cancelText="Batal"
                          onConfirm={handleDeleteSelected}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={cn(viewMode === "grid" && "bg-muted")}
                    disabled={isLoading}
                  >
                    <HugeiconsIcon icon={LayoutGridIcon} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={cn(viewMode === "list" && "bg-muted")}
                    disabled={isLoading}
                  >
                    <HugeiconsIcon icon={ListViewIcon} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="browse" className="flex flex-col flex-1 m-0 p-0">
            <div className="flex flex-col flex-1 p-6 overflow-hidden">
              {isFetching ? (
                <div className="flex flex-col justify-center items-center gap-4 h-full">
                  <HugeiconsIcon
                    icon={Loading01Icon}
                    className="w-8 h-8 text-muted-foreground animate-spin"
                  />
                  <p className="text-muted-foreground text-sm">
                    Memuat gambar...
                  </p>
                </div>
              ) : fetchError ? (
                <div className="flex flex-col justify-center items-center gap-4 h-full text-center">
                  <p className="font-medium text-destructive">
                    Gagal Memuat Gambar
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => mutate()}
                    disabled={isLoading}
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col justify-center items-center gap-4 h-full text-center">
                  <div className="flex justify-center items-center bg-muted rounded-full w-16 h-16">
                    <HugeiconsIcon
                      icon={Upload01Icon}
                      className="w-8 h-8 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-lg">Gambar Kosong</p>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Belum ada gambar yang diunggah. Mulai dengan mengunggah
                      gambar pertama Anda.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept =
                        "image/png,image/jpeg,image/jpg,image/webp";
                      input.multiple = true;
                      input.onchange = (e) => {
                        handleFileUpload((e.target as HTMLInputElement).files);
                      };
                      input.click();
                    }}
                    disabled={isLoading}
                  >
                    <HugeiconsIcon
                      icon={Upload01Icon}
                      className="mr-2 w-4 h-4"
                    />
                    Unggah Gambar Pertama
                  </Button>
                </div>
              ) : (
                <ScrollArea className="flex-1">
                  {viewMode === "grid" ? (
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {images.map((image) => {
                        const isSelected = localSelected.has(image.id);
                        return (
                          <button
                            key={image.id}
                            type="button"
                            disabled={isLoading}
                            className={cn(
                              "group relative hover:shadow-md border-2 rounded-lg w-full overflow-hidden text-left transition-all cursor-pointer flex flex-col h-auto p-0",
                              isSelected
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-border hover:border-primary/50",
                              isLoading && "opacity-50 cursor-not-allowed",
                            )}
                            onClick={() =>
                              !isLoading && toggleImageSelection(image)
                            }
                            aria-label={`${isSelected ? "Hapus" : "Pilih"} gambar ${image.fileName || "Untitled"}`}
                          >
                            <div className="relative bg-muted w-full aspect-square">
                              {image.fileUrl ? (
                                <Image
                                  width={300}
                                  height={300}
                                  src={image.fileUrl}
                                  alt={image.alt || image.fileName || "Image"}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex justify-center items-center w-full h-full text-muted-foreground text-xs">
                                  Tidak ada gambar
                                </div>
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 flex justify-center items-center bg-primary/20">
                                  <div className="bg-primary p-2 rounded-full text-primary-foreground">
                                    <HugeiconsIcon
                                      icon={Tick01Icon}
                                      className="w-5 h-5"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="bg-background w-full p-2">
                              <p className="font-medium text-xs truncate">
                                {image.fileName || "Untitled"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {images.map((image) => {
                        const isSelected = localSelected.has(image.id);
                        return (
                          <button
                            key={image.id}
                            type="button"
                            disabled={isLoading}
                            className={cn(
                              "flex items-center gap-4 hover:shadow-sm p-3 border-2 rounded-lg w-full text-left transition-all cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                              isLoading && "opacity-50 cursor-not-allowed",
                            )}
                            onClick={() =>
                              !isLoading && toggleImageSelection(image)
                            }
                            aria-label={`${isSelected ? "Hapus" : "Pilih"} gambar ${image.fileName || "Untitled"}`}
                          >
                            <div className="relative bg-muted rounded w-16 h-16 overflow-hidden shrink-0">
                              {image.fileUrl ? (
                                <Image
                                  width={64}
                                  height={64}
                                  src={image.fileUrl}
                                  alt={image.alt || image.fileName || "Image"}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex justify-center items-center w-full h-full text-muted-foreground text-xs">
                                  Tidak ada gambar
                                </div>
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 flex justify-center items-center bg-primary/20">
                                  <HugeiconsIcon
                                    icon={Tick01Icon}
                                    className="w-5 h-5 text-primary"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {image.fileName || "Untitled"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="selected" className="flex-1 m-0 p-6">
            <ScrollArea className="h-full">
              {getSelectedImages.length === 0 ? (
                <div className="flex flex-col justify-center items-center gap-4 h-full text-center">
                  <div className="flex justify-center items-center bg-muted rounded-full w-16 h-16">
                    <HugeiconsIcon
                      icon={SquareIcon}
                      className="w-8 h-8 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-lg">
                      Belum Ada Gambar Terpilih
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Kembali ke tab Browse untuk memilih gambar
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-muted-foreground text-sm">
                      {selectedCount} gambar terpilih
                    </p>
                    <AlertConfirmDialog
                      trigger={
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isLoading}
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            className="mr-2 w-4 h-4"
                          />
                          Hapus Semua Terpilih
                        </Button>
                      }
                      title="Hapus Gambar?"
                      description={`Anda yakin ingin menghapus ${selectedCount} gambar yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
                      confirmText={isDeleting ? "Menghapus..." : "Hapus"}
                      cancelText="Batal"
                      onConfirm={handleDeleteSelected}
                    />
                  </div>
                  <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {getSelectedImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative border rounded-lg overflow-hidden"
                      >
                        <div className="relative bg-muted aspect-square">
                          {image.fileUrl ? (
                            <Image
                              width={300}
                              height={300}
                              src={image.fileUrl}
                              alt={image.alt || image.fileName || "Image"}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex justify-center items-center w-full h-full text-muted-foreground text-xs">
                              Tidak ada gambar
                            </div>
                          )}
                        </div>
                        <div className="bg-background p-2">
                          <p className="font-medium text-xs truncate">
                            {image.fileName || "Untitled"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center bg-muted/30 px-6 py-4 border-t">
          <div className="text-muted-foreground text-sm">
            {selectedCount > 0 && <span>{selectedCount} gambar terpilih</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={handleFinish}
              disabled={selectedCount === 0 || isLoading}
            >
              Tambahkan Terpilih ({selectedCount})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
