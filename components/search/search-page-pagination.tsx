"use client";

import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchPagePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function SearchPagePagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: SearchPagePaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </Button>

            {getPageNumbers().map((page, index) => (
                <div key={index.toString()}>
                    {page === "..." ? (
                        <span className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                "h-10 w-10 rounded-full font-medium transition-all",
                                currentPage === page
                                    ? "bg-[#064e3b] text-white hover:bg-[#064e3b] hover:text-white dark:bg-[#064e3b]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {page}
                        </Button>
                    )}
                </div>
            ))}

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
            </Button>
        </div>
    );
}
