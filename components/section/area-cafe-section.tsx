"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { CafeCard, CafeCardSkeleton } from "@/components/card/cafe-card";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { REGION_OPTIONS } from "@/globals/data-options";

export interface AreaCafeSectionProps {
    cafes: any[];
    isLoading: boolean;
    selectedArea: string;
    onAreaChange: (area: string) => void;
}

export function AreaCafeSection({
    cafes,
    isLoading,
    selectedArea,
    onAreaChange,
}: AreaCafeSectionProps) {
    const [open, setOpen] = useState(false);

    // Find the label for the selected area value
    const selectedAreaLabel =
        REGION_OPTIONS.find((opt) => opt.value === selectedArea)?.label ||
        selectedArea;

    return (
        <section className="space-y-5">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Mencari kafe di lokasi
                    </h2>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                role="combobox"
                                aria-expanded={open}
                                className="text-3xl md:text-4xl font-bold text-foreground hover:bg-transparent hover:text-primary gap-2 w-fit h-auto"
                            >
                                <span>{selectedAreaLabel}</span>
                                <HugeiconsIcon
                                    icon={ArrowDown01Icon}
                                    className="w-8 h-8 md:w-10 md:h-10 mt-1"
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Cari lokasi (cth. Sukapura)..." />
                                <CommandList>
                                    <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                                    <CommandGroup heading="Lokasi Kafe">
                                        {REGION_OPTIONS.map((region) => (
                                            <CommandItem
                                                key={region.value}
                                                value={region.label}
                                                keywords={[region.value, region.alias]}
                                                onSelect={() => {
                                                    onAreaChange(region.value);
                                                    setOpen(false);
                                                }}
                                                className="cursor-pointer bg-white! hover:bg-secondary!"
                                            >
                                                {region.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <p className="text-muted-foreground text-base md:text-lg">
                    Temukan tempat nongkrong asik di sekitar {selectedAreaLabel}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Initial load skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                        <CafeCardSkeleton key={i.toString()} />
                    ))
                ) : cafes.length > 0 ? (
                    cafes.map((cafe: any) => (
                        <CafeCard
                            key={cafe.id}
                            href={`/cafe/${cafe.slug || cafe.id}`}
                            image={cafe.image}
                            rating={cafe.rating}
                            reviewCount={cafe.reviewCount}
                            name={cafe.name}
                            area={cafe.area}
                            category={cafe.category}
                            distance={cafe.distance}
                            openingHours={cafe.openingHours}
                            priceRange={cafe.priceRange}
                            capacity={cafe.capacity}
                            facilities={cafe.facilities}
                        />
                    ))
                ) : (
                    <Empty className="col-span-full border border-dashed bg-muted/30">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5" />
                            </EmptyMedia>
                            <EmptyTitle>
                                Belum ada cafe di area {selectedAreaLabel}
                            </EmptyTitle>
                            <EmptyDescription>Coba cari area lain ya!</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </section>
    );
}
