"use client";

import { AlertCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface AlertConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;

  onConfirm: () => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;

  closeOnConfirm?: boolean;
  disableWhileLoading?: boolean;
}

export interface AlertConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function AlertConfirmModal({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}: AlertConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle className="flex items-center flex-col justify-center w-full">
            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="h-7 w-7 text-destructive"
              />
            </div>
            {title}
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription className="text-center text-[15px]">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 sm:justify-center gap-2">
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={buttonVariants({ variant: "destructive" })}
          >
            {loading && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Keep existing default export
export default function AlertConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onSuccess,
  onError,
  closeOnConfirm = true,
}: AlertConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onSuccess?.();
      if (closeOnConfirm) setOpen(false);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {React.isValidElement(trigger) ? (
        React.cloneElement(
          trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
          {
            onClick: (e: React.MouseEvent) => {
              // Call original onClick if it exists
              const originalOnClick = (
                trigger.props as { onClick?: React.MouseEventHandler }
              ).onClick;
              if (originalOnClick) {
                originalOnClick(e);
              }
              setOpen(true);
            },
          },
        )
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          {trigger}
        </button>
      )}
      <AlertConfirmModal
        isOpen={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
}
