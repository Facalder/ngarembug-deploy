"use client";

import { ArrowDown01Icon, Store03FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CAFE_TYPE_OPTIONS } from "@/globals/data-options";
import { cn } from "@/lib/utils";

interface CafeTypeFilterProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function CafeTypeFilter({ value, onChange, className }: CafeTypeFilterProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    suppressHydrationWarning
                    variant="secondary"
                    className={cn(
                        "cursor-pointer bg-background hover:bg-secondary rounded-full px-6 py-3 text-base font-bold shadow-lg h-auto",
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Store03FreeIcons} className="w-6 h-6" />
                        Tipe:{" "}
                        <span className="font-medium text-muted-foreground">
                            {CAFE_TYPE_OPTIONS.find(t => t.value === value)?.label || "Pilih Tipe"}
                        </span>
                    </div>
                    <HugeiconsIcon icon={ArrowDown01Icon} className="w-6 h-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-[400px] p-6" align="center">
                <h3 className="text-lg font-semibold mb-4">Pilih Tipe Cafe</h3>
                <div className="flex flex-wrap gap-2">
                    {CAFE_TYPE_OPTIONS.map((type) => (
                        <button
                            type="button"
                            key={type.value}
                            onClick={() => {
                                onChange(type.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap",
                                value === type.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border",
                            )}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
