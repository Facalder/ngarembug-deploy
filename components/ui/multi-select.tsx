"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  onAddClick?: () => void;
  className?: string;
  maxDisplay?: number;
}

// Memoized badge component for optimal performance with large datasets
const SelectionBadge = React.memo(
  ({
    option,
    onRemove,
  }: {
    option: MultiSelectOption;
    onRemove: (value: string) => void;
  }) => {
    return (
      <Badge variant="secondary" className="gap-1 pr-1 text-xs h-6">
        {option.icon && <span className="shrink-0">{option.icon}</span>}
        <span className="truncate">{option.label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(option.value);
          }}
          className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          aria-label={`Remove ${option.label}`}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
        </button>
      </Badge>
    );
  },
);

SelectionBadge.displayName = "SelectionBadge";

// Memoized option item for maximum rendering performance
const OptionItem = React.memo(
  ({
    option,
    isSelected,
    onToggle,
  }: {
    option: MultiSelectOption;
    isSelected: boolean;
    onToggle: (value: string) => void;
  }) => {
    // Handle keyboard interactions for accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle(option.value);
      }
    };

    return (
      <div
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-secondary rounded-md cursor-pointer select-none transition-colors outline-none focus:bg-accent focus:text-accent-foreground"
        onClick={() => onToggle(option.value)}
        onKeyDown={handleKeyDown}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(option.value)}
          className="pointer-events-none"
          tabIndex={-1} // Remove from tab order as parent handles focus
        />
        {option.icon && <span className="shrink-0">{option.icon}</span>}
        <span className="text-sm flex-1 truncate">{option.label}</span>
      </div>
    );
  },
);

OptionItem.displayName = "OptionItem";

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  emptyText = "No results found.",
  onAddClick,
  className,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Use Map for O(1) lookup performance - critical for large datasets
  const optionsMap = React.useMemo(() => {
    return new Map(options.map((opt) => [opt.value, opt]));
  }, [options]);

  // Memoized filtering prevents unnecessary re-calculations
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter((option) =>
      (option.label || "").toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  // Memoized selected options array
  const selectedOptions = React.useMemo(() => {
    return value
      .map((v) => optionsMap.get(v))
      .filter(Boolean) as MultiSelectOption[];
  }, [value, optionsMap]);

  // Stable callbacks with useCallback to prevent child re-renders
  const handleToggle = React.useCallback(
    (optionValue: string) => {
      // Ensure value change always creates new reference for strict React responsiveness
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    },
    [value, onChange],
  );

  const handleSelectAll = React.useCallback(() => {
    const allValues = filteredOptions.map((opt) => opt.value);
    const allSelected = allValues.every((v) => value.includes(v));

    if (allSelected) {
      // Deselect all filtered options
      onChange(value.filter((v) => !allValues.includes(v)));
    } else {
      // Select all filtered options using Set for deduplication
      const newValues = new Set([...value, ...allValues]);
      onChange(Array.from(newValues));
    }
  }, [filteredOptions, value, onChange]);

  const handleClearAll = React.useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleRemove = React.useCallback(
    (optionValue: string) => {
      onChange(value.filter((v) => v !== optionValue));
    },
    [value, onChange],
  );

  // Memoized selection state for Select All checkbox
  const allFilteredSelected = React.useMemo(() => {
    if (filteredOptions.length === 0) return false;
    return filteredOptions.every((opt) => value.includes(opt.value));
  }, [filteredOptions, value]);

  const someFilteredSelected = React.useMemo(() => {
    return filteredOptions.some((opt) => value.includes(opt.value));
  }, [filteredOptions, value]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            tabIndex={0}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(!open);
              }
            }}
            className={cn(
              "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              "h-auto min-h-9 py-1.5 group cursor-pointer", // Custom styles
              className,
            )}
          >
            <div className="flex items-center gap-1.5 flex-wrap flex-1 text-left">
              {selectedOptions.length === 0 && (
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              )}
              {selectedOptions.length > 0 && (
                <React.Fragment key="selection-badges">
                  {selectedOptions.slice(0, maxDisplay).map((option) => (
                    <SelectionBadge
                      key={option.value}
                      option={option}
                      onRemove={handleRemove}
                    />
                  ))}
                  {selectedOptions.length > maxDisplay && (
                    <Badge variant="secondary" className="h-6">
                      +{selectedOptions.length - maxDisplay} more
                    </Badge>
                  )}
                </React.Fragment>
              )}
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className="ml-2 h-4 w-4 shrink-0 opacity-50 group-data-[state=open]:rotate-180 transition-transform duration-200"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <div className="flex flex-col gap-2 p-2">
            {/* Search Input */}
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>

            {/* Options List - structure ready for virtualization if needed */}
            <div className="flex flex-col gap-0.5 max-h-75 overflow-y-auto">
              {/* Select All Option */}
              {/** biome-ignore lint/a11y/useSemanticElements: <Males lagi kalo dibenerin takut berat> */}
              <div
                role="button"
                tabIndex={0}
                className="flex w-full items-center gap-2 px-2 py-1.5 hover:bg-secondary rounded-md cursor-pointer select-none font-medium transition-colors outline-none focus:bg-accent focus:text-accent-foreground"
                onClick={handleSelectAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectAll();
                  }
                }}
              >
                <Checkbox
                  checked={
                    allFilteredSelected
                      ? true
                      : someFilteredSelected
                        ? "indeterminate"
                        : false
                  }
                  className="pointer-events-none"
                  tabIndex={-1}
                />
                <span className="text-sm">(Select All)</span>
              </div>

              {/* Options */}
              {filteredOptions.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <OptionItem
                    key={option.value}
                    option={option}
                    isSelected={value.includes(option.value)}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex-1 bg-transparent"
                disabled={value.length === 0}
              >
                Clear
              </Button>
              {onAddClick && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onAddClick();
                    setOpen(false);
                  }}
                  className="flex-1 gap-1.5"
                >
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                  Add
                </Button>
              )}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
