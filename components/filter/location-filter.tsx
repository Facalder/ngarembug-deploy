"use client";

import {
    ArrowDown01Icon,
    Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { REGION_OPTIONS } from "@/globals/data-options";
import { cn } from "@/lib/utils";

interface LocationFilterProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function LocationFilter({ value, onChange, className }: LocationFilterProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    suppressHydrationWarning
                    variant="secondary"
                    className={cn(
                        "bg-background cursor-pointer hover:bg-secondary text-foreground rounded-full px-6 py-3 text-base font-bold shadow-lg h-auto",
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Location01Icon} className="w-6 h-6" />
                        Lokasi:{" "}
                        <span className="font-medium text-muted-foreground">
                            {REGION_OPTIONS.find(r => r.value === value)?.label || "Pilih Lokasi"}
                        </span>
                    </div>
                    <HugeiconsIcon icon={ArrowDown01Icon} className="w-6 h-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto max-w-[400px] p-6 transition-all ease-in duration-200"
                align="center"
            >
                <h3 className="text-lg font-semibold mb-4">Pilih Lokasi Cafe</h3>
                <div className="flex flex-wrap gap-2">
                    {REGION_OPTIONS.map((region) => (
                        <button
                            type="button"
                            key={region.value}
                            onClick={() => {
                                onChange(region.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap",
                                value === region.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border",
                            )}
                        >
                            {region.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
