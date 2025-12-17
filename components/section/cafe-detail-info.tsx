import {
    Call02Icon,
    Globe02Icon,
    Location01Icon,
    Money03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReviewModal } from "@/components/modal/review-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CafeDetailInfoProps {
    cafe: {
        id: string;
        description: string | null;
        priceRange: string;
        pricePerPerson: number;
        website?: string | null;
        phone?: string | null;
        mapLink?: string | null;
    };
    facilities: {
        name?: string;
        slug: string;
    }[];
}

export function CafeDetailInfo({ cafe, facilities }: CafeDetailInfoProps) {
    return (
        <div className="py-8 grid gap-8 md:grid-cols-[2fr_1fr]">
            {/* Main Content */}
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <div className="prose max-w-none text-muted-foreground">
                        <p>{cafe.description || "No description provided."}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                    {facilities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {facilities.map((facility, idx) => (
                                <Badge
                                    key={idx.toString()}
                                    variant="secondary"
                                >
                                    {facility.name || facility.slug}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">
                            No facilities listed.
                        </p>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    <div className="rounded-lg border border-dashed p-8 text-center bg-muted/30">
                        <p className="text-muted-foreground mb-4">
                            Belum ada review. Jadilah yang pertama mereview!
                        </p>
                        <ReviewModal cafeId={cafe.id} />
                    </div>
                </section>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4 sticky top-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Information</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <HugeiconsIcon
                                icon={Money03Icon}
                                className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5"
                            />
                            <div>
                                <p className="font-medium">Price Range</p>
                                <p className="text-muted-foreground capitalize">
                                    {cafe.priceRange} (~Rp {cafe.pricePerPerson.toLocaleString()})
                                </p>
                            </div>
                        </div>

                        {cafe.website && (
                            <div className="flex items-start gap-3">
                                <HugeiconsIcon
                                    icon={Globe02Icon}
                                    className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5"
                                />
                                <a
                                    href={cafe.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline truncate w-full"
                                >
                                    Website
                                </a>
                            </div>
                        )}

                        {cafe.phone && (
                            <div className="flex items-start gap-3">
                                <HugeiconsIcon
                                    icon={Call02Icon}
                                    className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5"
                                />
                                <a href={`tel:${cafe.phone}`} className="hover:underline">
                                    {cafe.phone}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex flex-col gap-2">
                        {cafe.mapLink && (
                            <Button className="w-full" asChild>
                                <a
                                    href={cafe.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        className="mr-2 h-4 w-4"
                                    />
                                    Get Directions
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
