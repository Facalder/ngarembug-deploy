import {
    ArrowDown01Icon,
    Wifi01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useApiQuery } from "@/lib/use-api-query";
import { cn } from "@/lib/utils";

interface FacilitiesFilterProps {
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

export function FacilitiesFilter({ value, onChange, className }: FacilitiesFilterProps) {
    const [open, setOpen] = useState(false);

    // Fetch facilities dynamically
    const { data: facilitiesData, isLoading } = useApiQuery({
        apiEndpoint: "facilities",
        syncWithUrl: false, // Don't sync with URL as this is a filter input
        defaults: {
            limit: 100, // Fetch enough facilities
        }
    });

    // Memoize options to prevent unnecessary re-renders
    const facilitiesOptions = useMemo(() => {
        return facilitiesData?.map((f: any) => ({
            name: f.name,
            slug: f.slug
        })) || [];
    }, [facilitiesData]);

    const toggleFacility = (slug: string) => {
        onChange(
            value.includes(slug)
                ? value.filter((f) => f !== slug)
                : [...value, slug],
        );
    };

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
                        <HugeiconsIcon icon={Wifi01Icon} className="w-6 h-6" />
                        Fasilitas:{" "}
                        <span className="font-medium text-muted-foreground">
                            {value.length > 0
                                ? value.slice(0, 2).map(slug => facilitiesOptions.find(f => f.slug === slug)?.name || slug).join(", ")
                                : "Pilih Fasilitas"}{" "}
                            {value.length > 2 && "..."}
                        </span>
                    </div>
                    <HugeiconsIcon icon={ArrowDown01Icon} className="w-6 h-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-[400px] p-6" align="center">
                <h3 className="text-lg font-semibold mb-4">Pilih Fasilitas</h3>
                <div className="flex flex-wrap gap-2">
                    {isLoading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : facilitiesOptions.length > 0 ? (
                        facilitiesOptions.map((facility) => (
                            <button
                                type="button"
                                key={facility.slug}
                                onClick={() => toggleFacility(facility.slug)}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap",
                                    value.includes(facility.slug)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted border-border",
                                )}
                            >
                                {facility.name}
                            </button>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">Tidak ada fasilitas</div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
