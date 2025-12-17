"use client";

import { Suspense } from "react";
import { CafeCard } from "@/components/card/cafe-card";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagePagination } from "@/components/search/search-page-pagination";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/lib/use-api-query";

function SearchPageContent() {
    const query = useApiQuery({
        apiEndpoint: "cafes?contentStatus=published",
        defaults: {
            limit: 12,
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Cafes</h1>
                    <p className="text-muted-foreground mt-1">
                        Find the perfect place for your meeting or hangout.
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto items-center">
                    <div className="w-full md:w-80">
                        <SearchInput
                            value={query.search}
                            onChange={query.setSearch}
                            placeholder="Search by name..."
                        />
                    </div>
                    {/* Mobile Filter Trigger embedded in Sidebar component */}
                    <div className="md:hidden">
                        <FilterSidebar query={query} />
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <FilterSidebar query={query} />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {query.isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-80 rounded-lg bg-muted animate-pulse"
                                />
                            ))}
                        </div>
                    ) : query.data.length === 0 ? (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                            <h3 className="text-lg font-semibold">No cafes found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your filters or search term.
                            </p>
                            <Button
                                onClick={() => query.clearFilters()}
                                className="mt-4"
                                variant="link"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {query.data.map((cafe: any) => (
                                    <CafeCard
                                        key={cafe.id}
                                        href={`/cafe/${cafe.slug}`}
                                        image={cafe.thumbnail || "/placeholder-cafe.jpg"}
                                        name={cafe.name}
                                        rating={cafe.averageRating || 0}
                                        reviewCount={cafe.totalReviews || 0}
                                        area={cafe.region}
                                        category={cafe.cafeType ? cafe.cafeType.replace(/_/g, " ") : ""}
                                        distance={cafe.distance ? `${cafe.distance}km` : "N/A"}
                                        openingHours={
                                            cafe.openingTime && cafe.closingTime
                                                ? `${cafe.openingTime} - ${cafe.closingTime}`
                                                : "See details"
                                        }
                                        priceRange={cafe.priceRange}
                                        capacity={cafe.capacity ? `${cafe.capacity} pax` : "N/A"}
                                        facilities={cafe.facilities?.map((f: any) => f.name) || []}
                                    />
                                ))}
                            </div>

                            <SearchPagePagination
                                currentPage={query.page}
                                totalPages={query.meta.totalPages}
                                onPageChange={query.setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchCafePage() {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-8">
                    <div className="h-8 w-48 animate-pulse rounded-md bg-muted mb-8" />
                    <div className="flex gap-8">
                        <div className="hidden w-64 md:block h-screen bg-muted animate-pulse rounded-md" />
                        <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-80 rounded-lg bg-muted animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <SearchPageContent />
        </Suspense>
    );
}