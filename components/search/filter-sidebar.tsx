"use client";

import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createEnumFilter } from "@/lib/enum-utils";
import { useApiQuery } from "@/lib/use-api-query";
import { FilterCheckboxGroup } from "./filter-checkbox-group";

// Create enum-based filter options
const REGION_FILTER = createEnumFilter("region", "Wilayah");
const CAFE_TYPE_FILTER = createEnumFilter("cafeType", "Tipe Cafe");
const PRICE_RANGE_FILTER = createEnumFilter("priceRange", "Range Harga");

interface FilterSidebarProps {
    query: ReturnType<typeof useApiQuery>;
}

export function FilterSidebar({ query }: FilterSidebarProps) {
    // Fetch facilities dynamically
    const { data: facilitiesData, isLoading: isFacilitiesLoading } = useApiQuery({
        apiEndpoint: "facilities",
        defaults: {
            limit: 100,
        },
    });

    const facilitiesOptions = useMemo(() => {
        return (
            facilitiesData?.map((f: any) => ({
                value: f.slug,
                label: f.name,
            })) || []
        );
    }, [facilitiesData]);

    // Helper to toggle filter values (similar to table-toolbar.tsx)
    const handleFilterToggle = (key: string, value: string) => {
        const currentValues = query.filters[key];
        const valuesArray = Array.isArray(currentValues)
            ? currentValues
            : currentValues
                ? String(currentValues).split(",")
                : [];

        const valueStr = value.toLowerCase();
        const currentValuesLower = valuesArray.map((v: string) => v.toLowerCase());

        let next: string[];
        if (currentValuesLower.includes(valueStr)) {
            // Remove value
            next = valuesArray.filter((v: string) => v.toLowerCase() !== valueStr);
        } else {
            // Add value
            next = [...valuesArray, valueStr];
        }

        query.setFilter(key, next);
    };

    const FilterContent = () => (
        <div className="space-y-8">
            <FilterCheckboxGroup
                label={REGION_FILTER.label}
                sectionId="region"
                options={REGION_FILTER.options}
                selectedValues={query.filters.region || []}
                onChange={(val) => handleFilterToggle("region", val)}
            />

            <FilterCheckboxGroup
                label={CAFE_TYPE_FILTER.label}
                sectionId="type"
                options={CAFE_TYPE_FILTER.options}
                selectedValues={query.filters.cafeType || []}
                onChange={(val) => handleFilterToggle("cafeType", val)}
            />

            <FilterCheckboxGroup
                label={PRICE_RANGE_FILTER.label}
                sectionId="price"
                options={PRICE_RANGE_FILTER.options}
                selectedValues={query.filters.priceRange || []}
                onChange={(val) => handleFilterToggle("priceRange", val)}
            />

            <FilterCheckboxGroup
                label="Fasilitas"
                sectionId="facilities"
                options={facilitiesOptions}
                selectedValues={query.filters.facilities || []}
                onChange={(val) => handleFilterToggle("facilities", val)}
                isLoading={isFacilitiesLoading}
            />

            <Button
                variant="outline"
                className="w-full"
                onClick={() => query.clearFilters()}
                size="sm"
            >
                Reset Filter
            </Button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 space-y-6">
                <h2 className="font-semibold text-lg">Filter</h2>
                <FilterContent />
            </div>

            {/* Mobile Modal Trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                        <HugeiconsIcon icon={FilterHorizontalIcon} className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-[90vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>Filter</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 px-6 py-6">
                        <FilterContent />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
