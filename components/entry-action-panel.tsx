"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import AlertConfirmDialog from "@/components/modal/alert-confirm-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

interface ActionButtonsPanelProps {
  isLoading: boolean;
  loadingDraft: boolean;
  loadingPublish: boolean;
  onCancel: () => void;
  onSubmitDraft: () => void;
  onSubmitPublish: () => void;
}

export function EntryActionPanel({
  isLoading,
  loadingDraft,
  loadingPublish,
  onCancel,
  onSubmitDraft,
  onSubmitPublish,
}: ActionButtonsPanelProps) {
  return (
    <aside className="space-y-4 md:sticky md:top-24 h-fit">
      <Card>
        <CardHeader>
          <CardDescription>ENTRY</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 grid">
          {/* CANCEL */}
          <AlertConfirmDialog
            title="Unsaved changes"
            description="Are you sure you want to leave this page? Your changes will not be saved."
            confirmText="Leave"
            cancelText="Stay"
            onConfirm={onCancel}
            trigger={
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            }
          />

          {/* SAVE AS DRAFT */}
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onSubmitDraft}
          >
            {loadingDraft && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 w-4 h-4 animate-spin"
              />
            )}
            Save as Draft
          </Button>

          {/* PUBLISH */}
          <Button type="button" disabled={isLoading} onClick={onSubmitPublish}>
            {loadingPublish && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 w-4 h-4 animate-spin"
              />
            )}
            Publish
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
