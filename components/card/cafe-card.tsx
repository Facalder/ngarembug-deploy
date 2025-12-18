import Link from "next/link";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Skeleton } from "@/components/ui/skeleton";

interface CafeCardProps {
    href: string;
    image: string;
    rating: number;
    reviewCount: number;
    name: string;
    region: string;
    cafeType: string;
    distance: number;
    priceRange: string;
    pricePerPerson: number;
    capacity: number;
    facilities: { name?: string; slug: string }[] | string[];
    orientation?: "vertical" | "horizontal";
}

const CafeCardComponent = ({
    href,
    image,
    rating,
    reviewCount,
    name,
    region,
    cafeType,
    distance,
    priceRange,
    pricePerPerson,
    capacity,
    facilities,
    orientation = "vertical",
}: CafeCardProps) => {
    const isHorizontal = orientation === "horizontal";

    // Helper to format enums (e.g., "indoor_cafe" -> "Indoor Cafe")
    const formatEnum = (str: string, fallback: string = "Info tidak tersedia") => {
        if (!str) return fallback;
        return str
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Helper to format price (e.g., 25000 -> "Rp 25.000")
    const formatPrice = (price: number) => {
        if (!price) return "Belum ada info"; // Zero or missing likely means unknown
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    return (
        <Link href={href} className="block group w-full">
            <Card
                className={`ring-0 border-0 p-0 gap-0 bg-transparent outline-none shadow-none rounded-none w-full ${isHorizontal ? "flex gap-6" : ""}`}
            >
                {/* Image Section */}
                <ResponsiveImage
                    src={image}
                    alt={name}
                    aspectRatio={isHorizontal ? undefined : "aspect-[4/3]"}
                    className={
                        isHorizontal
                            ? "w-60 shrink-0 h-48 rounded-md"
                            : "w-full mb-3 rounded-md"
                    }
                    sizes={
                        isHorizontal
                            ? "240px"
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    }
                    imageClassName="group-hover:scale-105 transition-transform duration-500"
                />

                {/* Content Section */}
                <div
                    className={`flex flex-col gap-2 ${isHorizontal ? "flex-1 py-1" : ""}`}
                >
                    {/* Rating & Status */}
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="flex items-center justify-center bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                            {rating ? Number(rating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-sm font-bold text-foreground">Approved</span>
                        <span className="text-xs text-muted-foreground">
                            ({reviewCount} Reviews)
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold tracking-tight text-foreground leading-tight group-hover:text-primary group-hover:underline transition-colors line-clamp-1">
                        {name}
                    </h3>

                    {/* Metadata: Region • Type • Distance */}
                    <div className="text-sm text-muted-foreground mb-4">
                        {formatEnum(region, "Lokasi Belum Tersedia")} • {formatEnum(cafeType, "Tipe Belum Tersedia")} • {distance} km
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Price/Person</span>
                            <span className="text-sm font-semibold text-foreground truncate">
                                {formatPrice(pricePerPerson)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Range</span>
                            <span className="text-sm font-semibold text-foreground truncate">
                                {formatEnum(priceRange, "-")}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Capacity</span>
                            <span className="text-sm font-semibold text-foreground truncate">
                                {capacity || "-"} Pax
                            </span>
                        </div>
                    </div>

                    {/* Facilities */}
                    {facilities && facilities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {facilities.slice(0, 3).map((facility, idx) => {
                                const label = typeof facility === 'string' ? facility : (facility.name || facility.slug);
                                return (
                                    <Badge
                                        key={idx.toString()}
                                        variant="secondary"
                                        className="bg-muted text-muted-foreground font-normal rounded-md px-2 py-0.5 text-xs pointer-events-none"
                                    >
                                        {label}
                                    </Badge>
                                );
                            })}
                            {facilities.length > 3 && (
                                <Badge
                                    variant="secondary"
                                    className="bg-muted text-muted-foreground font-normal rounded-md px-2 py-0.5 text-xs pointer-events-none"
                                >
                                    +{facilities.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
};

export const CafeCard = memo(CafeCardComponent);

export const CafeCardSkeleton = () => {
    return (
        <Card className="ring-0 p-0 gap-0 bg-transparent outline-none shadow-none rounded-none">
            {/* Image Section */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-md mb-3">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-2">
                {/* Rating & Status */}
                <div className="flex items-center gap-2 mb-0.5">
                    <Skeleton className="h-5 w-8 rounded-[4px]" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Title */}
                <Skeleton className="h-8 w-3/4" />

                {/* Metadata */}
                <Skeleton className="h-4 w-1/2 mb-4" />

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Facilities */}
                <div className="flex items-center flex-wrap gap-2">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                </div>
            </div>
        </Card>
    );
};
