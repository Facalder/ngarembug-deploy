import {
    Location01Icon,
    StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveImage } from "@/components/ui/responsive-image";

interface CafeDetailHeaderProps {
    cafe: {
        thumbnail: string | null;
        name: string;
        cafeType: string;
        address: string;
        averageRating: number;
        totalReviews: number;
    };
}

export function CafeDetailHeader({ cafe }: CafeDetailHeaderProps) {
    return (
        <div className="relative h-[50vh] w-full bg-muted">
            {cafe.thumbnail ? (
                <ResponsiveImage
                    src={cafe.thumbnail}
                    alt={cafe.name}
                    className="h-full w-full"
                    imageClassName="object-cover"
                    priority
                    fill
                    sizes="100vw"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-lg">
                    No Photos Available
                </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full container mx-auto">
                <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none capitalize">
                    {cafe.cafeType.replace(/_/g, " ")}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{cafe.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
                    <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Location01Icon} className="h-5 w-5" />
                        {cafe.address}
                    </div>
                    <div className="flex items-center gap-1">
                        <HugeiconsIcon
                            icon={StarIcon}
                            className="h-5 w-5 text-yellow-400 fill-yellow-400"
                        />
                        {cafe.averageRating} ({cafe.totalReviews} reviews)
                    </div>
                </div>
            </div>
        </div>
    );
}
