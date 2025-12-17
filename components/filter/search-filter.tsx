"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    CAFE_TYPE_OPTIONS,
    CAPACITY_OPTIONS,
    FACILITIES_OPTIONS,
    PRICE_RANGE_OPTIONS,
} from "@/globals/data-options";

export function SearchFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (key: string, value: string, checked: boolean) => {
            const params = new URLSearchParams(searchParams.toString());
            const current = params.get(key);
            const currentValues = current ? current.split("%") : [];

            const valueLower = value.toLowerCase();

            let newValues: string[];
            if (checked) {
                if (!currentValues.includes(valueLower)) {
                    newValues = [...currentValues, valueLower];
                } else {
                    newValues = currentValues;
                }
            } else {
                newValues = currentValues.filter((v) => v !== valueLower);
            }

            if (newValues.length > 0) {
                params.set(key, newValues.join("%"));
            } else {
                params.delete(key);
            }

            return params.toString();
        },
        [searchParams],
    );

    const handleCreateQueryString = (
        key: string,
        value: string,
        checked: boolean,
    ) => {
        const queryString = createQueryString(key, value, checked);
        router.push(`${pathname}?${queryString}`, { scroll: false });
    };

    const isChecked = (key: string, value: string) => {
        const current = searchParams.get(key);
        if (!current) return false;
        return current.split("%").includes(value.toLowerCase());
    };

    const handleReset = () => {
        router.push(pathname, { scroll: false });
    };

    return (
        <div className="w-full flex flex-col gap-6 p-6 rounded-md border">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Rentang Harga</h4>
                <div className="space-y-2">
                    {PRICE_RANGE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`price-${option.value}`}
                                checked={isChecked("price", option.value)}
                                onCheckedChange={(checked) =>
                                    handleCreateQueryString(
                                        "price",
                                        option.value,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label
                                htmlFor={`price-${option.value}`}
                                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Capacity */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Kapasitas</h4>
                <div className="space-y-2">
                    {CAPACITY_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`capacity-${option.value}`}
                                checked={isChecked("capacity", option.value)}
                                onCheckedChange={(checked) =>
                                    handleCreateQueryString(
                                        "capacity",
                                        option.value,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label
                                htmlFor={`capacity-${option.value}`}
                                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Cafe Type */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Tipe Cafe</h4>
                <div className="space-y-2">
                    {CAFE_TYPE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`type-${option.value}`}
                                checked={isChecked("type", option.value)}
                                onCheckedChange={(checked) =>
                                    handleCreateQueryString(
                                        "type",
                                        option.value,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label
                                htmlFor={`type-${option.value}`}
                                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Facilities */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Fasilitas</h4>
                <div className="space-y-2">
                    {FACILITIES_OPTIONS.slice(0, 5).map((facility) => (
                        <div key={facility} className="flex items-center space-x-2">
                            <Checkbox
                                id={`facility-${facility}`}
                                checked={isChecked("facilities", facility)}
                                onCheckedChange={(checked) =>
                                    handleCreateQueryString(
                                        "facilities",
                                        facility,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label
                                htmlFor={`facility-${facility}`}
                                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {facility}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
