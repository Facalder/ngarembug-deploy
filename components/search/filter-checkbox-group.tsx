"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterCheckboxGroupProps {
    label: string;
    sectionId: string;
    options: FilterOption[] | { value: string; label: string; alias?: string }[];
    selectedValues: string | string[];
    onChange: (value: string) => void;
    isLoading?: boolean;
}

export function FilterCheckboxGroup({
    label,
    sectionId,
    options,
    selectedValues,
    onChange,
    isLoading,
}: FilterCheckboxGroupProps) {
    const isSelected = (value: string) => {
        if (Array.isArray(selectedValues)) {
            // Case-insensitive comparison (matching table-toolbar.tsx pattern)
            return selectedValues.some(
                (v) => v.toLowerCase() === value.toLowerCase()
            );
        }
        return selectedValues?.toLowerCase() === value.toLowerCase();
    };

    return (
        <div className="space-y-3">
            <h3 className="font-medium text-sm text-foreground">{label}</h3>
            <div className="space-y-2">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center space-x-2 group"
                        >
                            <Checkbox
                                id={`${sectionId}-${option.value}`}
                                checked={isSelected(option.value)}
                                onCheckedChange={() => onChange(option.value)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                                htmlFor={`${sectionId}-${option.value}`}
                                className="text-sm font-normal text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
