"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10 h-11 bg-background"
            />
        </div>
    );
}
